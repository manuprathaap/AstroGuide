from fastapi.testclient import TestClient

from app.main import app
from app.schemas.palmistry import PalmAnalysisRequest
from app.services.palm_vision_service import PalmVisionService

client = TestClient(app)


def test_palm_service_direct():
    service = PalmVisionService()
    req = PalmAnalysisRequest(
        name="Manu Prathap",
        gender="Male",
        dominant_hand="Right",
        language="English",
    )
    res = service.analyze_palm_images(req)

    assert res.native_name == "Manu Prathap"
    assert res.gender == "Male"
    assert res.dominant_hand == "Right"
    assert res.language == "English"
    assert res.hand_constitution.vitality_index >= 80
    assert len(res.major_lines) == 5
    assert len(res.planetary_mounts) == 7
    assert len(res.special_signs) >= 2
    assert "career_and_wealth" in res.life_predictions
    assert len(res.gemstone_recommendations) >= 2


def test_palm_service_malayalam():
    service = PalmVisionService()
    req = PalmAnalysisRequest(
        name="Manu Prathap",
        gender="Male",
        dominant_hand="Right",
        language="Malayalam",
    )
    res = service.analyze_palm_images(req)

    assert res.language == "Malayalam"
    assert "ആയുർ രേഖ" in res.major_lines[0].sanskrit_name
    assert "ഗുരു" in res.planetary_mounts[0].name


def test_palm_api_analyze():
    payload = {
        "name": "Manu Prathap",
        "gender": "Male",
        "dominant_hand": "Right",
        "language": "English",
    }
    response = client.post("/api/v1/palmistry/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["native_name"] == "Manu Prathap"
    assert len(data["major_lines"]) == 5
    assert len(data["planetary_mounts"]) == 7


def test_palm_api_sample():
    response = client.get("/api/v1/palmistry/sample?language=English")
    assert response.status_code == 200
    data = response.json()
    assert data["language"] == "English"
    assert data["hand_constitution"]["vitality_index"] > 0
