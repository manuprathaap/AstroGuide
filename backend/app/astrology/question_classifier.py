from enum import StrEnum
import re


class QuestionType(StrEnum):
    MARRIAGE_TIMING = "MARRIAGE_TIMING"
    MARRIAGE = "MARRIAGE"
    CAREER_TIMING = "CAREER_TIMING"
    CAREER = "CAREER"
    FINANCE = "FINANCE"
    RELATIONSHIP = "RELATIONSHIP"
    FAMILY = "FAMILY"
    TRAVEL = "TRAVEL"
    FOREIGN_SETTLEMENT = "FOREIGN_SETTLEMENT"
    HEALTH = "HEALTH"
    EDUCATION = "EDUCATION"
    BUSINESS = "BUSINESS"
    LIFE_OVERVIEW = "LIFE_OVERVIEW"
    TIMING = "TIMING"
    FOLLOW_UP = "FOLLOW_UP"
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
_TRAVEL_TERMS = ("abroad", "foreign", "overseas", "videsh", "pravasi")
_RELATIONSHIP_TERMS = ("relationship", "partner", "love", "bandham", "premam")
_FAMILY_TERMS = ("family", "home", "parents", "kudumbam", "veedu")
_BUSINESS_TERMS = ("business", "startup", "entrepreneur", "vyaparam")
_LIFE_OVERVIEW_TERMS = ("life", "future", "main focus", "overall", "focus")
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


def classify_question(
    question: str,
    conversation_history: list[dict] | None = None,
) -> QuestionType:
    """Classify a user question using deterministic keyword rules."""
    normalized = _normalize(question)

    if conversation_history and _contains_any(
        normalized,
        ("that", "it", "reason", "athinte", "athinu", "why", "2027", "2028"),
    ):
        return QuestionType.FOLLOW_UP

    if _contains_any(normalized, _TIMING_TERMS) and _contains_any(
        normalized,
        _MARRIAGE_TERMS,
    ):
        return QuestionType.MARRIAGE_TIMING
    if _contains_any(normalized, _MARRIAGE_TERMS):
        return QuestionType.MARRIAGE
    if _contains_any(normalized, _TRAVEL_TERMS):
        return QuestionType.FOREIGN_SETTLEMENT
    if _contains_any(normalized, _BUSINESS_TERMS):
        return QuestionType.BUSINESS
    if _contains_any(normalized, _RELATIONSHIP_TERMS):
        return QuestionType.RELATIONSHIP
    if _contains_any(normalized, _FAMILY_TERMS):
        return QuestionType.FAMILY
    if _contains_any(normalized, _CAREER_TERMS):
        return QuestionType.CAREER
    if _contains_any(normalized, _FINANCE_TERMS):
        return QuestionType.FINANCE
    if _contains_any(normalized, _HEALTH_TERMS):
        return QuestionType.HEALTH
    if _contains_any(normalized, _EDUCATION_TERMS):
        return QuestionType.EDUCATION
    if _contains_any(normalized, _LIFE_OVERVIEW_TERMS):
        return QuestionType.LIFE_OVERVIEW
    return QuestionType.GENERAL


def _normalize(question: str) -> str:
    return re.sub(r"\s+", " ", question.strip().casefold())


def _contains_any(question: str, terms: tuple[str, ...]) -> bool:
    return any(re.search(rf"\b{re.escape(term)}\b", question) for term in terms)
