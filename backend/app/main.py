from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.init_db import init_db
from app.api.routes import auth, history, analyze

app = FastAPI(
    title=settings.project_name,
    version="0.1.0",
)

# ✅ FINAL PRODUCTION CORS CONFIG
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # Local development
        "http://localhost:3000",
        "http://127.0.0.1:3000",

        # Production frontend (Vercel)
        "https://internal-website-intel-tool.vercel.app",

        # Production backend (Render)
        "https://internal-website-intel-tool-1.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

# Routers
app.include_router(auth.router)
app.include_router(history.router)
app.include_router(analyze.router)

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "project": settings.project_name,
    }