import os
import json
import time
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from google import genai
import httpx

from app.services.prompts.astrology_prompt import (
    ASTROLOGY_SYSTEM_PROMPT,
    KERALA_VEDIC_ASTROLOGER_PROMPT,
)


# AstroGuide project root
PROJECT_ROOT = Path(__file__).resolve().parents[3]

# Load root .env
load_dotenv(PROJECT_ROOT / ".env")


class GuidanceExplanationError(RuntimeError):
    """Raised when the astrology explanation cannot be generated."""


# Backward compatibility alias
LLMServiceError = GuidanceExplanationError


class LLMService:
    PRIMARY_MODEL = "gemini-3.6-flash"
    GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
    DEFAULT_GROQ_MODEL = "openai/gpt-oss-120b"
    MAX_RETRIES = 2
    INITIAL_BACKOFF_SECONDS = 0.5
    MAX_CONVERSATION_TURNS = 2
    MAX_HISTORY_QUESTION_CHARS = 500
    MAX_HISTORY_RESPONSE_CHARS = 1200

    def __init__(self):
        self.provider = os.getenv("LLM_PROVIDER", "groq").strip().lower()
        self.groq_model = os.getenv("GROQ_MODEL", self.DEFAULT_GROQ_MODEL)
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        self.client = None

        if self.provider == "groq":
            if not self.groq_api_key:
                raise GuidanceExplanationError("GROQ_API_KEY is not configured.")
            self.model = self.groq_model
        elif self.provider == "gemini":
            api_key = os.getenv("GEMINI_API_KEY")
            if not api_key:
                raise GuidanceExplanationError("GEMINI_API_KEY is not configured.")
            try:
                self.client = genai.Client(api_key=api_key)
                self.model = self.PRIMARY_MODEL
            except Exception as e:
                raise GuidanceExplanationError(
                    f"Could not initialize Gemini client: {e}"
                ) from e
        else:
            raise GuidanceExplanationError(
                f"Unsupported LLM_PROVIDER: {self.provider}"
            )

    def generate_response(self, prompt: str, system_prompt: str | None = None) -> str:
        sys_prompt = system_prompt or ASTROLOGY_SYSTEM_PROMPT
        if self.provider == "groq":
            return self._generate_groq(prompt, sys_prompt)
        return self._generate_gemini(prompt, sys_prompt)

    def _generate_groq(self, prompt: str, system_prompt: str) -> str:
        payload = {
            "model": self.groq_model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt},
            ],
        }

        for attempt in range(self.MAX_RETRIES):
            try:
                with httpx.Client(timeout=120.0) as client:
                    response = client.post(
                        self.GROQ_API_URL,
                        headers={"Authorization": f"Bearer {self.groq_api_key}"},
                        json=payload,
                    )
                    response.raise_for_status()

                data = response.json()
                if not isinstance(data, dict):
                    raise ValueError("Groq returned an invalid response body.")

                choices = data.get("choices")
                if not isinstance(choices, list) or not choices:
                    raise ValueError("Groq returned no completion choices.")

                if not isinstance(choices[0], dict):
                    raise ValueError("Groq returned an invalid completion choice.")
                message = choices[0].get("message", {})
                content = message.get("content") if isinstance(message, dict) else None
                if not isinstance(content, str) or not content.strip():
                    raise ValueError("Groq returned an empty response.")

                return content.strip()
            except httpx.HTTPError as exc:
                if self._is_retryable(exc) and attempt + 1 < self.MAX_RETRIES:
                    time.sleep(self.INITIAL_BACKOFF_SECONDS * (2**attempt))
                    continue
                status_code = getattr(
                    getattr(exc, "response", None), "status_code", None
                )
                status_message = f" (HTTP {status_code})" if status_code else ""
                raise GuidanceExplanationError(
                    f"Groq explanation service failed{status_message}: {exc}"
                ) from exc
            except (ValueError, TypeError, IndexError) as exc:
                raise GuidanceExplanationError(
                    f"Groq explanation service returned an invalid response: {exc}"
                ) from exc

        raise GuidanceExplanationError("Groq explanation service failed after retries.")

    def _generate_gemini(self, prompt: str, system_prompt: str) -> str:
        last_error: Exception | None = None

        for attempt in range(self.MAX_RETRIES):
            try:
                interaction = self.client.interactions.create(
                    model=self.PRIMARY_MODEL,
                    input=prompt,
                    system_instruction=system_prompt,
                )

                output_text = getattr(interaction, "output_text", None)
                if not output_text:
                    raise RuntimeError("Gemini returned an empty response.")

                self.model = self.PRIMARY_MODEL
                return output_text
            except Exception as exc:
                last_error = exc
                if self._is_retryable(exc) and attempt + 1 < self.MAX_RETRIES:
                    time.sleep(self.INITIAL_BACKOFF_SECONDS * (2**attempt))
                    continue

                raise GuidanceExplanationError(
                    f"Gemini explanation service failed: {exc}"
                ) from exc

        raise GuidanceExplanationError(
            f"Gemini explanation service failed: {last_error}"
        ) from last_error

    @staticmethod
    def _is_retryable(error: Exception) -> bool:
        # Check HTTP status codes for transient conditions
        response = getattr(error, "response", None)
        status = (
            getattr(error, "code", None)
            or getattr(error, "status", None)
            or getattr(error, "status_code", None)
            or getattr(response, "status_code", None)
        )
        if status in (429, 500, 502, 503, 504):
            return True
        if isinstance(error, (TimeoutError, ConnectionError, httpx.TimeoutException, httpx.NetworkError)):
            return True
        message = str(error).upper()
        return "RESOURCE_EXHAUSTED" in message or "UNAVAILABLE" in message or "TIMEOUT" in message

    def generate_astrology_response(
        self,
        question: str,
        language: str,
        astrology_analysis: dict,
    ) -> str:
        prompt = f"""
USER QUESTION:
{question}

REQUESTED LANGUAGE:
{language}

ASTROLOGY ANALYSIS:
{astrology_analysis}

Now explain the astrology analysis in the requested language.

Answer the user's question directly and naturally.
Use ONLY the astrology information provided above.
Do not calculate or invent any astrology information.
"""
        return self.generate_response(prompt)

    def generate_conversational_response(
        self,
        question: str,
        language: str,
        astrology_context: dict,
        conversation_history: list[dict] | None = None,
    ) -> str:
        recent_history = self._compact_conversation_history(conversation_history)
        prompt = f"""
CURRENT USER QUESTION:
{question}

REQUESTED LANGUAGE:
{language}

CALCULATED ASTROLOGY CONTEXT (SOURCE OF TRUTH):
{json.dumps(astrology_context, ensure_ascii=False, default=str)}

RECENT CONVERSATION:
{json.dumps(recent_history, ensure_ascii=False, default=str)}

LANGUAGE AND CLARITY:
Write for a reader who may know nothing about astrology. Prefer everyday
words in {language}. Never leave a technical term unexplained: explain it
briefly in the same sentence, and do not list a planet and house without
plainly describing why that detail matters to the question. In Malayalam,
prefer familiar planet names and explain "ഭാവം" as a life area, "മഹാദശ"
as a longer planetary period, and "അന്തർദശ" as a shorter period within it.
Keep paragraphs and bullets short, with one main idea each.

Answer the current question naturally in the requested language. Use the
conversation only to resolve references such as 'that' or 'why'; use the
calculated context for every astrology claim. Do not invent missing data.
"""
        return self.generate_response(prompt)

    @classmethod
    def _compact_conversation_history(
        cls,
        conversation_history: list[dict] | None,
    ) -> list[dict[str, str]]:
        if not conversation_history:
            return []

        recent_turns = conversation_history[-cls.MAX_CONVERSATION_TURNS :]
        compact_history = []
        for turn in recent_turns:
            question = str(turn.get("question", ""))[
                : cls.MAX_HISTORY_QUESTION_CHARS
            ]
            response = str(turn.get("response", ""))[
                : cls.MAX_HISTORY_RESPONSE_CHARS
            ]
            category = str(turn.get("category", ""))
            compact_history.append(
                {
                    "question": question,
                    "response": response,
                    "category": category,
                }
            )
        return compact_history

    def generate_kerala_astrology_profile(
        self,
        name: str,
        date_time_str: str,
        coordinates_str: str,
        calculated_lagna: str,
        calculated_moon: str,
        planetary_longitudes: dict[str, Any],
        language: str = "Malayalam",
    ) -> str:
        prompt = f"""
INPUT DETAILS:
- Name: {name}
- Date & Time: {date_time_str}
- Coordinates: {coordinates_str}
- Calculated Lagna: {calculated_lagna}
- Calculated Moon (Chandra): {calculated_moon}
- Planetary Longitudes: {json.dumps(planetary_longitudes, ensure_ascii=False)}
- Preferred Language: {language}

Follow all CRITICAL RULES strictly:
1. STRICT CONSISTENCY: Every attribute (Ganam, Yoni, Animal, Bird, Tree, Bhutam, Deity, Panchangam) MUST strictly match the calculated Janma Nakshatra (Moon Star).
2. DO NOT HALLUCINATE OR SHIFT SIGNS:
   - Treat the calculated Lagna strictly as 1st house, and subsequent signs as 2nd, 3rd, ... 12th houses.
   - Derive Sun sign strictly from Sun's longitude.
3. Provide the output in {language} following the 4 required sections:
   1. Birth Details & Panchangam
   2. Janma Nakshatra Details
   3. Planetary Positions Table
   4. Bhava Phalangal (1 to 12 Bhavas starting strictly with the calculated Lagna)
"""
        return self.generate_response(prompt, system_prompt=KERALA_VEDIC_ASTROLOGER_PROMPT)
