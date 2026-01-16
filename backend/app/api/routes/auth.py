from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse
from app.core.security import verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


# 🔥 REQUIRED: Allow CORS preflight for login
@router.options("/login")
def login_options():
    return Response(status_code=status.HTTP_200_OK)


@router.post("/login", response_model=TokenResponse)
def login(
    data: LoginRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.username == data.username).first()

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    # Create JWT
    token = create_access_token(subject=user.username)

    # 🔐 SET COOKIE (CRITICAL FOR VERCEL → RENDER)
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,          # REQUIRED on HTTPS
        samesite="none",      # REQUIRED for cross-site
        path="/",
        max_age=60 * 60,      # 1 hour
    )

    # Also return token (optional, good for debugging)
    return {"access_token": token}