from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.models.user import User
from app.core.security import hash_password
from app.core.config import settings


def init_db():
    Base.metadata.create_all(bind=engine)
    create_internal_user()


def create_internal_user():
    db = SessionLocal()

    user = db.query(User).filter(
        User.username == settings.admin_username
    ).first()

    if not user:
        user = User(
            username=settings.admin_username,
            hashed_password=hash_password(settings.admin_password),
        )
        db.add(user)
        db.commit()

    db.close()