import os
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types

from app.services.prompts.astrology_prompt import ASTROLOGY_SYSTEM_PROMPT


# AstroGuide project root
PROJECT_ROOT = Path(__file__).resolve().parents[3]

# Load root .env
load_dotenv(PROJECT_ROOT / ".env")


class LLMService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise RuntimeError(
                "GEMINI_API_KEY is not configured."
            )

        self.client = genai.Client(api_key=api_key)

        self.model = "gemini-3.6-flash"

    def generate_response(self, prompt: str) -> str:
        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=ASTROLOGY_SYSTEM_PROMPT,
            ),
        )

        if not response.text:
            raise RuntimeError("Gemini returned an empty response.")

        return response.text

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