import httpx
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.config import GEOAPIFY_API_KEY
from app.core.dependencies import get_current_user, get_optional_current_user
from app.database.connection import get_db
from app.models.birth_detail import BirthDetail
from app.models.user import User
from app.schemas.birth_detail import (
    BirthDetailCreate,
    BirthDetailUpdate,
    BirthDetailResponse,
    BirthPlaceSearchResponse,
)



router = APIRouter(
    prefix="/birth-details",
    tags=["Birth Details"],
)


@router.get(
    "/places/search",
    response_model=BirthPlaceSearchResponse,
)
def search_birth_places(
    query: str = Query(..., min_length=2, max_length=100),
    current_user: User | None = Depends(get_optional_current_user),
):
    if not GEOAPIFY_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Geoapify is not configured.",
        )

    try:
        response = httpx.get(
            "https://api.geoapify.com/v1/geocode/search",
            params={
                "text": query,
                "apiKey": GEOAPIFY_API_KEY,
                "limit": 5,
                "format": "json",
            },
            timeout=5.0,
        )
        response.raise_for_status()
        payload = response.json()
    except httpx.TimeoutException as exc:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="The place search timed out.",
        ) from exc
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unable to connect to Geoapify.",
        ) from exc
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Geoapify rejected the place search request.",
        ) from exc
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Geoapify returned an invalid response.",
        ) from exc

    if not isinstance(payload, dict):
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Geoapify returned an invalid response.",
        )

    provider_results = payload.get("results", [])
    if not isinstance(provider_results, list):
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Geoapify returned an invalid response.",
        )

    places = []
    for result in provider_results[:5]:
        if not isinstance(result, dict):
            continue

        properties = result.get("properties", result)
        if not isinstance(properties, dict):
            continue

        latitude = properties.get("lat")
        longitude = properties.get("lon")
        formatted_address = properties.get("formatted")
        if not isinstance(latitude, (int, float)) or not isinstance(
            longitude, (int, float)
        ) or not isinstance(formatted_address, str):
            continue

        place_name = next(
            (
                properties.get(field)
                for field in (
                    "name",
                    "city",
                    "town",
                    "village",
                    "municipality",
                    "county",
                    "state",
                    "country",
                )
                if isinstance(properties.get(field), str)
                and properties.get(field).strip()
            ),
            formatted_address,
        )

        timezone_data = properties.get("timezone")
        timezone_name = (
            timezone_data.get("name")
            if isinstance(timezone_data, dict)
            and isinstance(timezone_data.get("name"), str)
            else None
        )
        country = properties.get("country")
        places.append(
            {
                "place_name": place_name,
                "formatted_address": formatted_address,
                "latitude": latitude,
                "longitude": longitude,
                "timezone": timezone_name,
                "country": country if isinstance(country, str) else None,
            }
        )

    return {"results": places}


@router.post(
    "",
    response_model=BirthDetailResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_birth_details(
    birth_detail: BirthDetailCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing_birth_details = (
        db.query(BirthDetail)
        .filter(BirthDetail.user_id == current_user.id)
        .first()
    )

    if existing_birth_details:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Birth details already exist for this user.",
        )

    new_birth_details = BirthDetail(
        user_id=current_user.id,
        date_of_birth=birth_detail.date_of_birth,
        time_of_birth=birth_detail.time_of_birth,
        place_of_birth=birth_detail.place_of_birth,
        latitude=birth_detail.latitude,
        longitude=birth_detail.longitude,
        timezone=birth_detail.timezone,
    )

    db.add(new_birth_details)
    db.commit()
    db.refresh(new_birth_details)

    return new_birth_details

@router.get(
    "",
    response_model=BirthDetailResponse,
)
def get_birth_details(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    birth_details = (
        db.query(BirthDetail)
        .filter(BirthDetail.user_id == current_user.id)
        .first()
    )

    if birth_details is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Birth details not found.",
        )

    return birth_details

@router.put(
    "",
    response_model=BirthDetailResponse,
)
def update_birth_details(
    birth_detail: BirthDetailUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing_birth_details = (
        db.query(BirthDetail)
        .filter(BirthDetail.user_id == current_user.id)
        .first()
    )

    if existing_birth_details is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Birth details not found.",
        )

    update_data = birth_detail.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(existing_birth_details, field, value)

    db.commit()
    db.refresh(existing_birth_details)

    return existing_birth_details


@router.delete(
    "",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_birth_details(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing_birth_details = (
        db.query(BirthDetail)
        .filter(BirthDetail.user_id == current_user.id)
        .first()
    )

    if existing_birth_details is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Birth details not found.",
        )

    db.delete(existing_birth_details)
    db.commit()

    return None