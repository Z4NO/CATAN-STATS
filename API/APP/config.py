from pydantic import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    ENVIRONMENT: str


    class config:
        env_file = ".env"

settings = Settings()