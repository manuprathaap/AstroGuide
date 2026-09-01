from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router


app = FastAPI(
    title="AstroGuide API",
    description="Backend API for the AstroGuide astrology application",
    version="1.0.0",
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",
        "http://127.0.0.1:4200",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# API routes
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