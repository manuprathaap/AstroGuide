from unittest.mock import MagicMock, Mock
import json

import httpx
import pytest

from app.services.llm_service import GuidanceExplanationError, LLMService


def _groq_service(monkeypatch):
    monkeypatch.setenv("LLM_PROVIDER", "groq")
    monkeypatch.setenv("GROQ_API_KEY", "test-key")
    monkeypatch.setenv("GROQ_MODEL", "test-model")
    return LLMService()


def _mock_http_client(monkeypatch, post):
    client = MagicMock()
    client.__enter__.return_value = client
    client.__exit__.return_value = None
    if isinstance(post, list):
        client.post.side_effect = post
    else:
        client.post.return_value = post
    monkeypatch.setattr(
        "app.services.llm_service.httpx.Client",
        Mock(return_value=client),
    )
    return client


def test_groq_response_uses_chat_completions_api(monkeypatch):
    service = _groq_service(monkeypatch)
    response = Mock()
    response.json.return_value = {
        "choices": [{"message": {"content": "  A grounded answer.  "}}]
    }
    client = _mock_http_client(monkeypatch, response)

    answer = service.generate_response("Question", "System instructions")

    assert answer == "A grounded answer."
    client.post.assert_called_once_with(
        LLMService.GROQ_API_URL,
        headers={"Authorization": "Bearer test-key"},
        json={
            "model": "test-model",
            "messages": [
                {"role": "system", "content": "System instructions"},
                {"role": "user", "content": "Question"},
            ],
        },
    )


def test_groq_provider_requires_api_key(monkeypatch):
    monkeypatch.setenv("LLM_PROVIDER", "groq")
    monkeypatch.delenv("GROQ_API_KEY", raising=False)

    with pytest.raises(GuidanceExplanationError, match="GROQ_API_KEY"):
        LLMService()


def test_groq_uses_current_recommended_model_by_default(monkeypatch):
    monkeypatch.setenv("LLM_PROVIDER", "groq")
    monkeypatch.setenv("GROQ_API_KEY", "test-key")
    monkeypatch.delenv("GROQ_MODEL", raising=False)

    service = LLMService()

    assert service.groq_model == "openai/gpt-oss-120b"


def test_groq_retries_transient_http_errors(monkeypatch):
    service = _groq_service(monkeypatch)
    service.INITIAL_BACKOFF_SECONDS = 0
    unavailable = httpx.Response(
        503,
        request=httpx.Request("POST", LLMService.GROQ_API_URL),
    )
    success = Mock()
    success.json.return_value = {"choices": [{"message": {"content": "Recovered"}}]}
    client = _mock_http_client(monkeypatch, [unavailable, success])

    assert service.generate_response("Question") == "Recovered"
    assert client.post.call_count == 2


def test_conversational_prompt_bounds_history_size(monkeypatch):
    service = _groq_service(monkeypatch)
    service.generate_response = Mock(return_value="Answer")
    history = [
        {
            "question": f"Question {index}" + ("q" * 1000),
            "response": f"Response {index}" + ("r" * 5000),
            "category": "FOLLOW_UP",
        }
        for index in range(5)
    ]

    answer = service.generate_conversational_response(
        question="When will I get married?",
        language="English",
        astrology_context={"question_type": "MARRIAGE_TIMING"},
        conversation_history=history,
    )

    prompt = service.generate_response.call_args.args[0]
    serialized_history = prompt.split("RECENT CONVERSATION:\n", 1)[1].split(
        "\n\nLANGUAGE AND CLARITY:",
        1,
    )[0]
    compact_history = json.loads(serialized_history)

    assert answer == "Answer"
    assert len(compact_history) == 2
    assert compact_history[0]["question"].startswith("Question 3")
    assert len(compact_history[0]["question"]) == service.MAX_HISTORY_QUESTION_CHARS
    assert len(compact_history[0]["response"]) == service.MAX_HISTORY_RESPONSE_CHARS


def test_conversational_prompt_requests_plain_language_explanations(monkeypatch):
    service = _groq_service(monkeypatch)
    service.generate_response = Mock(return_value="Answer")

    service.generate_conversational_response(
        question="When will I get married?",
        language="Malayalam",
        astrology_context={"question_type": "MARRIAGE_TIMING"},
    )

    prompt = service.generate_response.call_args.args[0]
    assert "Write for a reader who may know nothing about astrology" in prompt
    assert "Never leave a technical term unexplained" in prompt
    assert '"മഹാദശ"' in prompt
