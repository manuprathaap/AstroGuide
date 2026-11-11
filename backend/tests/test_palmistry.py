import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.base import Base
from app.database.connection import get_db
from app.main import app
from app.schemas.palmistry import PalmAnalysisRequest
from app.services.palm_vision_service import PalmVisionService

@pytest.fixture
def client():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    test_session = sessionmaker(bind=engine)
    original_overrides = app.dependency_overrides.copy()

    def override_get_db():
        with test_session() as db:
            yield db

    app.dependency_overrides[get_db] = override_get_db

    try:
        with TestClient(app) as test_client:
            yield test_client
    finally:
        app.dependency_overrides.clear()
        app.dependency_overrides.update(original_overrides)
        engine.dispose()


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


def test_palm_api_analyze(client):
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


def test_palm_api_sample(client):
    response = client.get("/api/v1/palmistry/sample?language=English")
    assert response.status_code == 200
    data = response.json()
    assert data["language"] == "English"
    assert data["hand_constitution"]["vitality_index"] > 0
