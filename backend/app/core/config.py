from pydantic_settings import BaseSettings
from functools import lru_cache
import os


class Settings(BaseSettings):
    POSTGRES_USER: str = "urban_user"
    POSTGRES_PASSWORD: str = "postgres_secret_2026"
    POSTGRES_DB: str = "urban_companion"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432

    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379

    JWT_SECRET_KEY: str = "dev-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 1440

    OPENWEATHER_API_KEY: str = ""
    HERE_TRAFFIC_API_KEY: str = ""
    OPENROUTE_API_KEY: str = ""

    LLM_API_URL: str = "http://localhost:11434"
    MLFLOW_TRACKING_URI: str = "http://localhost:5000"

    USE_SQLITE: bool = True

    @property
    def database_url(self) -> str:
        if self.USE_SQLITE:
            db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "urban_companion.db")
            return f"sqlite+aiosqlite:///{db_path}"
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    class Config:
        env_file = ".env"
        extra = "allow"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
