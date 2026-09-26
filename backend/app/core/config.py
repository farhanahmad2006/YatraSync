# Changes made by @MdFarhanAhmad
import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "YatraSync API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Environment Configuration (development, staging, production)
    APP_ENV: str = os.getenv("APP_ENV", "development")
    
    # Master OTP Configuration (Development/Staging ONLY)
    NON_SUPERADMIN_MASTER_OTP: str = os.getenv("NON_SUPERADMIN_MASTER_OTP", "9568")
    SUPERADMIN_MASTER_OTP: str = os.getenv("SUPERADMIN_MASTER_OTP", "8659")
    
    # PostgreSQL Database Connection on Port 5432
    PG_HOST: str = os.getenv("PG_HOST", os.getenv("POSTGRES_HOST", "127.0.0.1"))
    PG_PORT: int = int(os.getenv("PG_PORT", os.getenv("POSTGRES_PORT", 5432)))
    PG_USER: str = os.getenv("PG_USER", os.getenv("POSTGRES_USER", "postgres"))
    PG_PASSWORD: str = os.getenv("PG_PASSWORD", os.getenv("POSTGRES_PASSWORD", "Rocky007."))
    PG_DB: str = os.getenv("PG_DB", os.getenv("POSTGRES_DB", "safarsetu_db"))
    
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql+psycopg2://{self.PG_USER}:{self.PG_PASSWORD}@{self.PG_HOST}:{self.PG_PORT}/{self.PG_DB}"

    # Security JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "safarsetu_super_secret_jwt_key_2026_india_travel_platform")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

settings = Settings()
