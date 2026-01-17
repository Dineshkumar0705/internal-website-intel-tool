from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest
from app.core.security import verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


# ✅ EXPLICIT OPTIONS HANDLER (CRITICAL)
@router.options("/login", include_in_schema=False)
def login_options():
    return Response(status_code=200)


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

    # ✅ SET COOKIE FOR NEXT.JS MIDDLEWARE
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,        # HTTPS only (Render)
        samesite="None",    # Required for Vercel → Render
        max_age=60 * 60 * 24
    )

    return {"message": "Login successful"}