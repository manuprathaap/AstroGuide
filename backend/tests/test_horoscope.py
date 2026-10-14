from datetime import date, time
from fastapi.testclient import TestClient

from app.main import app
from app.schemas.horoscope import HoroscopeGenerateRequest
from app.astrology.horoscope import HoroscopeCalculator

client = TestClient(app)


def test_horoscope_calculator_direct():
    calc = HoroscopeCalculator()
    req = HoroscopeGenerateRequest(
        name="Manu Prathap",
        gender="Male",
        date_of_birth=date(2003, 2, 5),
        time_of_birth=time(4, 5),
        place_of_birth="Pannimattom",
        latitude=9.92,
        longitude=76.84,
        timezone="Asia/Kolkata",
    )
    res = calc.generate(req)

    assert res.personal_info["name"] == "Manu Prathap"
    assert res.personal_info["gender_malayalam"] == "പുരുഷൻ"
    assert res.personal_info["day_of_week"] == "Wednesday"
    assert res.personal_info["day_of_week_malayalam"] == "ബുധൻ"
    assert res.sun_sign["name"] == "AQUARIUS"
    assert res.moon_sign["malayalam"] == "മീനം"
    assert res.panchanga["nakshatra"]["malayalam"] in ["പൂരൂരുട്ടാതി", "പൂരുരുട്ടാതി"]
    assert len(res.rashi_chart.boxes) == 12
    assert len(res.navamsha_chart.boxes) == 12
    assert res.rashi_chart.center_title == "രാശി ചാർട്ട്"
    assert res.rashi_chart.center_subtitle in ["പൂരൂരുട്ടാതി", "പൂരുരുട്ടാതി"]
    assert "നവാംശ ചാർട്ട്" in res.navamsha_chart.center_title
    assert len(res.chapters) == 4
    assert res.shloka["sanskrit"].startswith("जननी")


def test_horoscope_generate_endpoint_public():
    payload = {
        "name": "Manu Prathap",
        "gender": "Male",
        "date_of_birth": "2003-02-05",
        "time_of_birth": "04:05:00",
        "place_of_birth": "Pannimattom",
        "latitude": 9.92,
        "longitude": 76.84,
        "timezone": "Asia/Kolkata",
        "chart_style": "Kerala",
        "language": "Malayalam",
    }
    response = client.post("/api/v1/horoscope/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["personal_info"]["name"] == "Manu Prathap"
    assert data["sun_sign"]["name"] == "AQUARIUS"
    assert data["moon_sign"]["malayalam"] == "മീനം"
    assert len(data["rashi_chart"]["boxes"]) == 12
    assert len(data["navamsha_chart"]["boxes"]) == 12
    assert len(data["planetary_positions"]) >= 9


def test_anuradha_nakshatra_reference():
    from app.astrology.nakshatra_data import get_nakshatra_attributes

    anizham = get_nakshatra_attributes("Anuradha")
    assert anizham["malayalam"] == "അനിഴം"
    assert anizham["lord"]["English"] == "Saturn"
    assert anizham["lord"]["Malayalam"] == "ശനി"
    assert anizham["ganam"]["English"] == "Deva"
    assert anizham["ganam"]["Malayalam"] == "ദേവഗണം"
    assert anizham["yoni_gender"]["English"] == "Female"
    assert "മാൻ" in anizham["animal"]["Malayalam"]
    assert "കാക്ക" in anizham["bird"]["Malayalam"]
    assert "ഇലഞ്ഞി" in anizham["tree"]["Malayalam"]
    assert anizham["element"]["English"].startswith("Fire")
    assert "അഗ്നി" in anizham["element"]["Malayalam"]
    assert "മിത്രൻ" in anizham["deity"]["Malayalam"]


def test_horoscope_lagna_and_nakshatra_consistency():
    calc = HoroscopeCalculator()
    # Test chart with Sagittarius Lagna
    req = HoroscopeGenerateRequest(
        name="Test Native",
        gender="Male",
        date_of_birth=date(2003, 2, 5),
        time_of_birth=time(4, 5),
        place_of_birth="Pannimattom",
        latitude=9.92,
        longitude=76.84,
        timezone="Asia/Kolkata",
        language="Malayalam",
    )
    res = calc.generate(req)

    # Janma nakshatra attributes in Table 3 must strictly match Moon star
    t3 = res.chapters[0].items[0].sub_tables[2]
    t3_dict = {row.label: row.value for row in t3.rows}
    assert "നരൻ" in t3_dict["ഗണം, യോനി, മൃഗം"]
    assert "മയിൽ" in t3_dict["പക്ഷി, വൃക്ഷം"]

    # Chapter 2 item 2 attributes must strictly match Moon star
    ch2_item2 = res.chapters[1].items[1]
    assert "നരൻ" in ch2_item2.prediction_text
    assert "മയിൽ" in ch2_item2.prediction_text
    assert "തേന്മാവ്" in ch2_item2.prediction_text

    # Chapter 3 (12 Bhavas) must strictly start with calculated Lagna
    ch3 = res.chapters[2]
    assert len(ch3.items) == 12
    asc_sign_mal = res.ascendant["sign_malayalam"]
    assert asc_sign_mal in ch3.items[0].prediction_text

