from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    # App
    project_name: str = Field(default="Internal Website Intelligence Tool")

    # Security
    secret_key: str
    access_token_expire_minutes: int = 60

    # Database
    database_url: str

    # OpenAI
    openai_api_key: str

    # Internal admin (login-only system)
    admin_username: str
    admin_password: str

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()