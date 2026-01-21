from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    ENVIRONMENT: str
    APP_NAME: str = "Catan Stats API"
    ADMIN_EMAIL: str


    class Config:
        env_file = ".env"

settings = Settings()