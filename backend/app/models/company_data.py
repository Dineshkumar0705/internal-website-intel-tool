from sqlalchemy import Column, Integer, String, Text, DateTime, func
from app.db.base import Base


class CompanyData(Base):
    __tablename__ = "company_data"

    id = Column(Integer, primary_key=True, index=True)
    website = Column(String(500), nullable=False, index=True)
    data = Column(Text, nullable=False)  # Stored JSON (string)
    created_at = Column(DateTime(timezone=True), server_default=func.now())