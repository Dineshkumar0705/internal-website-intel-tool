from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.db.init_db import init_db
from app.api.routes import auth, history, analyze

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title=settings.project_name,
    version="0.1.0",
)

# ✅ FIXED CORS (supports Vercel previews)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://internal-website-intel-tool.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",  # 🔥 THIS FIXES IT
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiting
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Too many requests"},
    )

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(auth.router)
app.include_router(history.router)
app.include_router(analyze.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}