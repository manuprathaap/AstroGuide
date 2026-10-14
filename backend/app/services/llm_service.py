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


import logging

logger = logging.getLogger(__name__)


class LLMService:
    PRIMARY_MODEL = "gemini-3.6-flash"
    MAX_RETRIES = 2
    INITIAL_BACKOFF_SECONDS = 0.5

    def __init__(self):
        self.provider = os.getenv("LLM_PROVIDER", "gemini").lower()
        self.ollama_base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434").rstrip("/")
        self.ollama_model = os.getenv("OLLAMA_MODEL", "llama3")

        api_key = os.getenv("GEMINI_API_KEY")
        if api_key and self.provider != "ollama":
            try:
                self.client = genai.Client(api_key=api_key)
                self.model = self.PRIMARY_MODEL
            except Exception as e:
                logger.warning("Could not initialize Gemini client: %s. Falling back to Ollama.", e)
                self.client = None
                self.provider = "ollama"
                self.model = self.ollama_model
        else:
            self.client = None
            self.provider = "ollama"
            self.model = self.ollama_model

    def generate_response(self, prompt: str, system_prompt: str | None = None) -> str:
        sys_prompt = system_prompt or ASTROLOGY_SYSTEM_PROMPT
        # If provider is explicitly ollama, use ollama directly
        if self.provider == "ollama" or not self.client:
            return self._generate_ollama(prompt, sys_prompt)

        # Try Gemini, and automatically fall back to Ollama if Gemini quota or connection fails
        try:
            return self._generate_gemini(prompt, sys_prompt)
        except Exception as exc:
            logger.warning(
                "Gemini service failed (%s). Automatically falling back to local Ollama (%s).",
                exc,
                self.ollama_model,
            )
            try:
                return self._generate_ollama(prompt, sys_prompt)
            except Exception as ollama_exc:
                raise GuidanceExplanationError(
                    f"Gemini failed ({exc}) and local Ollama fallback also failed: {ollama_exc}"
                ) from ollama_exc

    def _generate_ollama(self, prompt: str, system_prompt: str) -> str:
        url = f"{self.ollama_base_url}/api/chat"
        payload = {
            "model": self.ollama_model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt},
            ],
            "stream": False,
        }
        try:
            with httpx.Client(timeout=120.0) as client:
                response = client.post(url, json=payload)
                response.raise_for_status()
                data = response.json()
                content = data.get("message", {}).get("content", "").strip()
                if not content:
                    raise RuntimeError("Ollama returned an empty response.")
                return content
        except httpx.ConnectError as exc:
            raise GuidanceExplanationError(
                f"Cannot connect to Ollama at {self.ollama_base_url}. Make sure Ollama is running ('ollama serve')."
            ) from exc
        except Exception as exc:
            raise GuidanceExplanationError(
                f"Ollama local explanation service failed: {exc}"
            ) from exc

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

