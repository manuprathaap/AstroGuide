import pytest

from app.astrology.question_classifier import QuestionType, classify_question


@pytest.mark.parametrize(
    ("question", "expected"),
    [
        ("When will I get married?", QuestionType.MARRIAGE_TIMING),
        ("Ente kalyanam eppol nadakkum?", QuestionType.MARRIAGE_TIMING),
        ("Will I get married?", QuestionType.MARRIAGE),
        ("Ente joli engane aakum?", QuestionType.CAREER),
        ("How will my career be?", QuestionType.CAREER),
        ("Ente paisa situation engane?", QuestionType.FINANCE),
        ("How is my health?", QuestionType.HEALTH),
        ("Ente padanam engane aakum?", QuestionType.EDUCATION),
        ("Tell me about my travel plans", QuestionType.GENERAL),
    ],
)
def test_classifies_supported_question_categories(question, expected):
    assert classify_question(question) == expected


def test_classification_is_case_insensitive():
    assert classify_question("wHeN WILL I GET MARRIED?") == QuestionType.MARRIAGE_TIMING


def test_extra_whitespace_is_ignored():
    assert classify_question("  Ente   marriage   eppol?  ") == QuestionType.MARRIAGE_TIMING
