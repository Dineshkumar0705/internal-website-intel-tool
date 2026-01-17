from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest
from app.core.security import verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
def login(
    data: LoginRequest,
    response: Response,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == data.username).first()

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(subject=user.username)

    # ✅ SET COOKIE (THIS IS THE KEY)
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,          # REQUIRED on Render (HTTPS)
        samesite="None",      # REQUIRED for Vercel → Render
        max_age=60 * 60 * 24  # 1 day
    )

    return {"message": "Login successful"}