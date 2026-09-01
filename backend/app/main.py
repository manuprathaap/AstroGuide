from fastapi import FastAPI
from app.api.v1.router import api_router

app = FastAPI(
    title="AstroGuide API",
    description="Backend API for the AstroGuide astrology application",
    version="1.0.0",
)

app.include_router(api_router)

@app.get("/")
def root():
    return {
        "message": "Welcome to AstroGuide API",
        "status": "running",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
    }