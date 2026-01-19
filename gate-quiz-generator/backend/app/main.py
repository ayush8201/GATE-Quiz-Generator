from dotenv import load_dotenv
load_dotenv()  # Load .env file before other imports

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.routers import upload, quiz, hint

# Create uploads directory if it doesn't exist
UPLOADS_DIR = Path(__file__).parent.parent / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)

app = FastAPI(
    title="GATE Quiz Generator API",
    description="API for parsing GATE exam PDFs and generating interactive quizzes",
    version="1.0.0"
)

# Serve extracted figures and static assets
app.mount(
    "/assets",
    StaticFiles(directory="backend/assets"),
    name="assets"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(quiz.router, prefix="/api", tags=["quiz"])
app.include_router(hint.router, prefix="/api", tags=["hint"])


@app.get("/")
async def root():
    return {"message": "GATE Quiz Generator API", "status": "running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
