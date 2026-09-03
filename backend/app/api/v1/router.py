from fastapi import APIRouter

from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.languages import router as languages_router
from app.api.v1.endpoints.users import router as users_router
from app.api.v1.endpoints.birth_details import router as birth_details_router
from app.api.v1.endpoints.guidance import router as guidance_router

api_router = APIRouter(
    prefix="/api/v1",
)

api_router.include_router(auth_router)
api_router.include_router(languages_router)
api_router.include_router(users_router)
api_router.include_router(birth_details_router)
api_router.include_router(guidance_router)