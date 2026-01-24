from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    ENVIRONMENT: str
    APP_NAME: str = "Catan Stats API"
    ADMIN_EMAIL: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int


    class Config:
        env_file = ".env"

settings = Settings()