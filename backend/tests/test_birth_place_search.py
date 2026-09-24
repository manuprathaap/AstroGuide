import httpx
import pytest
from fastapi import HTTPException

from app.api.v1.endpoints import birth_details


class FakeGeoapifyResponse:
    def __init__(self, payload, status_code=200):
        self.payload = payload
        self.status_code = status_code

    def raise_for_status(self):
        if self.status_code >= 400:
            request = httpx.Request("GET", "https://api.geoapify.com")
            response = httpx.Response(self.status_code, request=request)
            raise httpx.HTTPStatusError(
                "upstream error", request=request, response=response
            )

    def json(self):
        return self.payload


@pytest.mark.parametrize(
    "query",
    [
        "Kochi",
        "Thrissur",
        "Bangalore",
        "Mumbai",
        "Delhi",
        "London",
        "Koc",
        "Thris",
        "Bang",
    ],
)
def test_search_birth_places_returns_geoapify_shape(monkeypatch, query):
    monkeypatch.setattr(birth_details, "GEOAPIFY_API_KEY", "test-key")
    monkeypatch.setattr(
        birth_details.httpx,
        "get",
        lambda *args, **kwargs: FakeGeoapifyResponse(
            {
                "results": [
                    {
                        "properties": {
                            "name": query,
                            "formatted": f"{query}, India",
                            "lat": 10.0,
                            "lon": 76.0,
                            "timezone": {"name": "Asia/Kolkata"},
                            "country": "India",
                        },
                        "place_id": "must-not-be-returned",
                    }
                ]
            }
        ),
    )

    result = birth_details.search_birth_places(query=query, current_user=object())

    assert result == {
        "results": [
            {
                "place_name": query,
                "formatted_address": f"{query}, India",
                "latitude": 10.0,
                "longitude": 76.0,
                "timezone": "Asia/Kolkata",
                "country": "India",
            }
        ]
    }


def test_search_birth_places_returns_empty_results(monkeypatch):
    monkeypatch.setattr(birth_details, "GEOAPIFY_API_KEY", "test-key")
    monkeypatch.setattr(
        birth_details.httpx,
        "get",
        lambda *args, **kwargs: FakeGeoapifyResponse({"results": []}),
    )

    assert birth_details.search_birth_places("UnknownRandomPlace123", object()) == {
        "results": []
    }


def test_search_birth_places_returns_null_for_missing_timezone(monkeypatch):
    monkeypatch.setattr(birth_details, "GEOAPIFY_API_KEY", "test-key")
    monkeypatch.setattr(
        birth_details.httpx,
        "get",
        lambda *args, **kwargs: FakeGeoapifyResponse(
            {
                "results": [
                    {
                        "properties": {
                            "city": "London",
                            "formatted": "London, United Kingdom",
                            "lat": 51.5,
                            "lon": -0.1,
                            "country": "United Kingdom",
                        }
                    }
                ]
            }
        ),
    )

    result = birth_details.search_birth_places("London", object())

    assert result["results"][0]["timezone"] is None


def test_search_birth_places_limits_results_to_five(monkeypatch):
    monkeypatch.setattr(birth_details, "GEOAPIFY_API_KEY", "test-key")
    monkeypatch.setattr(
        birth_details.httpx,
        "get",
        lambda *args, **kwargs: FakeGeoapifyResponse(
            {
                "results": [
                    {
                        "properties": {
                            "name": str(index),
                            "formatted": str(index),
                            "lat": index,
                            "lon": index,
                        }
                    }
                    for index in range(8)
                ]
            }
        ),
    )

    assert len(birth_details.search_birth_places("Kochi", object())["results"]) == 5


@pytest.mark.parametrize(
    "error",
    [httpx.TimeoutException("timeout"), httpx.RequestError("network error")],
)
def test_search_birth_places_handles_network_errors(monkeypatch, error):
    monkeypatch.setattr(birth_details, "GEOAPIFY_API_KEY", "test-key")

    def raise_error(*args, **kwargs):
        raise error

    monkeypatch.setattr(birth_details.httpx, "get", raise_error)

    with pytest.raises(HTTPException) as raised:
        birth_details.search_birth_places("Kochi", object())

    assert raised.value.status_code in {502, 504}


def test_search_birth_places_handles_http_error(monkeypatch):
    monkeypatch.setattr(birth_details, "GEOAPIFY_API_KEY", "test-key")
    monkeypatch.setattr(
        birth_details.httpx,
        "get",
        lambda *args, **kwargs: FakeGeoapifyResponse({}, status_code=401),
    )

    with pytest.raises(HTTPException) as raised:
        birth_details.search_birth_places("Kochi", object())

    assert raised.value.status_code == 502


def test_search_birth_places_handles_invalid_response(monkeypatch):
    monkeypatch.setattr(birth_details, "GEOAPIFY_API_KEY", "test-key")
    monkeypatch.setattr(
        birth_details.httpx,
        "get",
        lambda *args, **kwargs: FakeGeoapifyResponse({"results": "invalid"}),
    )

    with pytest.raises(HTTPException) as raised:
        birth_details.search_birth_places("Kochi", object())

    assert raised.value.status_code == 502
