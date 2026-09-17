from enum import StrEnum
import re


class QuestionType(StrEnum):
    MARRIAGE_TIMING = "MARRIAGE_TIMING"
    MARRIAGE = "MARRIAGE"
    CAREER = "CAREER"
    FINANCE = "FINANCE"
    HEALTH = "HEALTH"
    EDUCATION = "EDUCATION"
    GENERAL = "GENERAL"


_TIMING_TERMS = (
    "when",
    "what time",
    "how soon",
    "eppol",
    "epol",
    "eppozha",
    "eppozhanu",
    "eppo",
    "aakum",
    "akum",
    "nadakkum",
    "nadakkumo",
)
_MARRIAGE_TERMS = (
    "marriage",
    "married",
    "wedding",
    "kalyanam",
    "kalyana",
)
_CAREER_TERMS = (
    "career",
    "job",
    "work",
    "joli",
    "udyogam",
)
_FINANCE_TERMS = (
    "finance",
    "financial",
    "money",
    "income",
    "wealth",
    "paisa",
    "panam",
    "sampath",
)
_HEALTH_TERMS = (
    "health",
    "healthy",
    "illness",
    "disease",
    "sick",
    "arogyam",
    "aarogyam",
)
_EDUCATION_TERMS = (
    "education",
    "study",
    "studies",
    "school",
    "college",
    "exam",
    "padanam",
    "vidyabhyasam",
)


def classify_question(question: str) -> QuestionType:
    """Classify a user question using deterministic keyword rules."""
    normalized = _normalize(question)

    if _contains_any(normalized, _TIMING_TERMS) and _contains_any(
        normalized,
        _MARRIAGE_TERMS,
    ):
        return QuestionType.MARRIAGE_TIMING
    if _contains_any(normalized, _MARRIAGE_TERMS):
        return QuestionType.MARRIAGE
    if _contains_any(normalized, _CAREER_TERMS):
        return QuestionType.CAREER
    if _contains_any(normalized, _FINANCE_TERMS):
        return QuestionType.FINANCE
    if _contains_any(normalized, _HEALTH_TERMS):
        return QuestionType.HEALTH
    if _contains_any(normalized, _EDUCATION_TERMS):
        return QuestionType.EDUCATION
    return QuestionType.GENERAL


def _normalize(question: str) -> str:
    return re.sub(r"\s+", " ", question.strip().casefold())


def _contains_any(question: str, terms: tuple[str, ...]) -> bool:
    return any(re.search(rf"\b{re.escape(term)}\b", question) for term in terms)
