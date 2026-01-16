from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.db.init_db import init_db
from app.api.routes import auth, history, analyze

app = FastAPI(
    title=settings.project_name,
    version="0.1.0",
)

# ✅ PRODUCTION + LOCAL CORS (CORRECT & SAFE)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # Local development
        "http://localhost:3000",
        "http://127.0.0.1:3000",

        # Production frontend (Vercel)
        "https://internal-website-intel-tool.vercel.app",
    ],
    allow_credentials=True,      # 🔥 REQUIRED FOR COOKIE AUTH
    allow_methods=["*"],         # 🔥 REQUIRED FOR OPTIONS
    allow_headers=["*"],         # 🔥 REQUIRED FOR OPTIONS
)

# ✅ GLOBAL OPTIONS HANDLER (CRITICAL FIX)
@app.options("/{full_path:path}")
async def preflight_handler(full_path: str, request: Request):
    origin = request.headers.get("origin")

    return JSONResponse(
        content={"message": "OK"},
        headers={
            "Access-Control-Allow-Origin": origin if origin else "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Authorization, Content-Type",
            "Access-Control-Allow-Credentials": "true",
        },
    )

# Startup
@app.on_event("startup")
def on_startup():
    init_db()

# Routers
app.include_router(auth.router)
app.include_router(history.router)
app.include_router(analyze.router)

# Health check
@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "project": settings.project_name,
    }