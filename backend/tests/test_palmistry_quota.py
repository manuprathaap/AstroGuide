from types import SimpleNamespace

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.dependencies import get_optional_current_user
from app.database.base import Base
from app.database.connection import get_db
from app.main import app


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


def _payload():
    return {
        "name": "Seeker",
        "gender": "Male",
        "dominant_hand": "Right",
        "language": "English",
    }


def test_anonymous_user_gets_one_analysis_per_browser(client):
    origin = "http://localhost:4200"
    first = client.post(
        "/api/v1/palmistry/analyze",
        json=_payload(),
        headers={"Origin": origin},
    )
    guest_token = first.headers.get("X-Palm-Guest-Token")

    assert first.status_code == 200
    assert guest_token
    assert "X-Palm-Guest-Token" in first.headers.get(
        "access-control-expose-headers",
        "",
    )

    second = client.post(
        "/api/v1/palmistry/analyze",
        json=_payload(),
        headers={
            "Origin": origin,
            "X-Palm-Guest-Token": guest_token,
        },
    )

    assert second.status_code == 403
    assert second.json()["detail"] == (
        "Your free palm analysis has been used. Sign in to analyze another palm."
    )


def test_public_sample_does_not_consume_free_analysis(client):
    sample = client.get("/api/v1/palmistry/sample?language=English")
    analysis = client.post("/api/v1/palmistry/analyze", json=_payload())

    assert sample.status_code == 200
    assert analysis.status_code == 200


def test_upload_endpoint_uses_the_same_guest_quota(client):
    first = client.post(
        "/api/v1/palmistry/upload-and-analyze",
        data={"language": "English"},
    )
    guest_token = first.headers.get("X-Palm-Guest-Token")

    second = client.post(
        "/api/v1/palmistry/upload-and-analyze",
        data={"language": "English"},
        headers={"X-Palm-Guest-Token": guest_token},
    )

    assert first.status_code == 200
    assert guest_token
    assert second.status_code == 403


def test_failed_analysis_releases_anonymous_reservation(client, monkeypatch):
    from app.api.v1.endpoints import palmistry

    token = palmistry._new_guest_token()
    original_analyzer = palmistry.palm_service.analyze_palm_images

    def fail_analysis(_request):
        raise RuntimeError("Temporary analysis failure")

    monkeypatch.setattr(palmistry.palm_service, "analyze_palm_images", fail_analysis)

    with pytest.raises(RuntimeError, match="Temporary analysis failure"):
        client.post(
            "/api/v1/palmistry/analyze",
            json=_payload(),
            headers={"X-Palm-Guest-Token": token},
        )

    monkeypatch.setattr(
        palmistry.palm_service,
        "analyze_palm_images",
        original_analyzer,
    )
    retry = client.post(
        "/api/v1/palmistry/analyze",
        json=_payload(),
        headers={"X-Palm-Guest-Token": token},
    )

    assert retry.status_code == 200


def test_authenticated_user_can_analyze_repeatedly(client):
    app.dependency_overrides[get_optional_current_user] = lambda: SimpleNamespace(
        id=1,
        is_active=True,
    )

    first = client.post("/api/v1/palmistry/analyze", json=_payload())
    second = client.post("/api/v1/palmistry/analyze", json=_payload())

    assert first.status_code == 200
    assert second.status_code == 200
    assert "X-Palm-Guest-Token" not in first.headers


def test_temporary_llm_test_endpoints_require_authentication(client):
    llm_test = client.get("/api/v1/astrology/test-llm")
    marriage_llm_test = client.post("/api/v1/astrology/test-marriage-llm")

    assert llm_test.status_code == 401
    assert marriage_llm_test.status_code == 401


def test_cors_allows_local_frontend_and_guest_token_header(client):
    response = client.options(
        "/api/v1/palmistry/analyze",
        headers={
            "Origin": "http://localhost:4200",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "X-Palm-Guest-Token",
        },
    )

    assert response.headers["access-control-allow-origin"] == "http://localhost:4200"
    assert response.headers["access-control-allow-credentials"] == "true"
    assert "x-palm-guest-token" in response.headers[
        "access-control-allow-headers"
    ].lower()
