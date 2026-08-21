from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
import os

class Settings(BaseSettings):
    COGNODB_URI: Optional[str] = None
    COGNODB_USER: str = "cognodb"
    COGNODB_PASSWORD: Optional[str] = None
    COGNODB_DATABASE: str = "neo4j"
    
    APP_ENV: str = "development"
    DEMO_MODE_FALLBACK: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
