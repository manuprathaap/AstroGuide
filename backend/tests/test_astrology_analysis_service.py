from datetime import date, time

from app.astrology.analysis.service import AstrologyAnalysisService
from app.models.birth_detail import BirthDetail


def kochi_birth() -> BirthDetail:
    return BirthDetail(
        user_id=1,
        date_of_birth=date(1998, 5, 10),
        time_of_birth=time(10, 30),
        place_of_birth="Kochi",
        latitude=9.9312,
        longitude=76.2673,
        timezone="Asia/Kolkata",
    )


def test_marriage_analysis_service():
    result = AstrologyAnalysisService().analyze_marriage(
        kochi_birth()
    )

    assert result.seventh_house_sign
    assert result.seventh_house_lord

    assert result.seventh_lord_sign
    assert result.seventh_lord_house is not None

    assert result.venus_sign
    assert result.jupiter_sign

    assert result.current_mahadasha
    assert result.current_antardasha

    assert len(result.factors) > 0