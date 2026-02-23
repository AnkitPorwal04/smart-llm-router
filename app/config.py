from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # API configuration
    api_key: str = Field(..., description="LLM API key (Gemini, OpenAI, Groq, etc.)")
    api_base_url: str = Field(
        default="https://generativelanguage.googleapis.com/v1beta/openai/",
        description="OpenAI-compatible API base URL",
    )

    # Classifier settings
    classifier_mode: str = Field(
        default="heuristic",
        description="Classification strategy: heuristic | llm | hybrid",
    )
    confidence_threshold: float = Field(
        default=0.7,
        description="Hybrid classifier: confidence below this triggers LLM classification",
    )

    # Model selection (defaults to Google Gemini)
    system1_model: str = Field(default="gemini-2.5-flash-lite", description="Fast/cheap model (System 1)")
    system2_model: str = Field(default="gemini-2.5-flash", description="Advanced/powerful model (System 2)")
    classifier_model: str = Field(
        default="gemini-2.5-flash-lite",
        description="Model used for LLM-based classification",
    )

    # Pricing (USD per 1M tokens)
    model_pricing: dict = Field(default_factory=lambda: {
        "gemini-2.5-flash-lite": {"input": 0.05, "output": 0.20},
        "gemini-2.0-flash": {"input": 0.10, "output": 0.40},
        "gemini-2.5-flash": {"input": 0.15, "output": 0.60},
        "gemini-2.5-pro": {"input": 1.25, "output": 10.00},
        "gpt-4o-mini": {"input": 0.15, "output": 0.60},
        "gpt-4o": {"input": 2.50, "output": 10.00},
    })

    # Server
    log_level: str = Field(default="INFO")

    # Fallback
    fallback_to_system2: bool = Field(
        default=True,
        description="If System 1 fails, fallback to System 2",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
