from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt

from app.core.config import settings

# ---------------- PASSWORD HASHING ----------------

# PBKDF2 is stable, secure, and has no native dependencies
pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto"
)

def hash_password(password: str) -> str:
    """Hash a plain password"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plain password against hashed password"""
    return pwd_context.verify(plain_password, hashed_password)


# ---------------- JWT TOKEN ----------------

ALGORITHM = "HS256"

def create_access_token(subject: str) -> str:
    """
    Create JWT access token

    subject: usually username or user_id
    """
    expire = datetime.utcnow() + timedelta(
        minutes=settings.access_token_expire_minutes
    )

    payload = {
        "sub": subject,
        "exp": expire,
        "type": "access",  # 👈 useful for future extension
    }

    token = jwt.encode(
        payload,
        settings.secret_key,
        algorithm=ALGORITHM
    )

    return token