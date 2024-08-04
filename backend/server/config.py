from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    oc_base_url: str
    oc_current_period_messages_path: str
    oc_reports_path: str
    host: str
    port: int

    model_config = SettingsConfigDict(env_file="../.env")


settings = Settings()
