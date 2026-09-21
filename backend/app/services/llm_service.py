import os
import json
import time
from pathlib import Path

from dotenv import load_dotenv
from google import genai
import httpx

from app.services.prompts.astrology_prompt import ASTROLOGY_SYSTEM_PROMPT


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
    MAX_RETRIES = 2
    INITIAL_BACKOFF_SECONDS = 0.5

    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise RuntimeError(
                "GEMINI_API_KEY is not configured."
            )

        self.client = genai.Client(api_key=api_key)
        self.model = self.PRIMARY_MODEL

    def generate_response(self, prompt: str) -> str:
        last_error: Exception | None = None

        for attempt in range(self.MAX_RETRIES):
            try:
                interaction = self.client.interactions.create(
                    model=self.PRIMARY_MODEL,
                    input=prompt,
                    system_instruction=ASTROLOGY_SYSTEM_PROMPT,
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
                    "Gemini explanation service failed."
                ) from exc

        raise GuidanceExplanationError(
            "Gemini explanation service failed."
        ) from last_error

    @staticmethod
    def _is_retryable(error: Exception) -> bool:
        # Check HTTP status codes for transient conditions
        status = getattr(error, "code", None) or getattr(error, "status", None) or getattr(error, "status_code", None)
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
        prompt = f"""
CURRENT USER QUESTION:
{question}

REQUESTED LANGUAGE:
{language}

CALCULATED ASTROLOGY CONTEXT (SOURCE OF TRUTH):
{json.dumps(astrology_context, ensure_ascii=False, default=str)}

RECENT CONVERSATION:
{json.dumps(conversation_history or [], ensure_ascii=False, default=str)}

Answer the current question naturally in the requested language. Use the
conversation only to resolve references such as 'that' or 'why'; use the
calculated context for every astrology claim. Do not invent missing data.
"""
        return self.generate_response(prompt)
