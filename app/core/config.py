from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "greenchain"
    DB_USER: str = "greenchain_user"
    DB_PASSWORD: str = "greenchain_pass"
    SECRET_KEY: str = "greenchain-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    class Config:
        env_file = ".env"

settings = Settings()