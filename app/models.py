import time
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class ComplexityLevel(str, Enum):
    SYSTEM1 = "system1"
    SYSTEM2 = "system2"


class ClassificationResult(BaseModel):
    complexity: ComplexityLevel
    confidence: float = Field(ge=0.0, le=1.0)
    reasoning: str = ""
    classifier_used: str = ""


class RouteRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=10000)
    system_prompt: Optional[str] = Field(
        default=None,
        description="Optional system prompt to prepend",
    )
    force_model: Optional[str] = Field(
        default=None,
        description="Override routing — force a specific model",
    )


class RouteResponse(BaseModel):
    answer: str
    model_used: str
    complexity: ComplexityLevel
    classification_confidence: float
    classifier_used: str
    latency_ms: float
    token_usage: dict
    estimated_cost_usd: float


class MetricsSummary(BaseModel):
    total_requests: int
    requests_by_complexity: dict[str, int]
    requests_by_model: dict[str, int]
    avg_latency_ms: float
    total_tokens_used: int
    total_estimated_cost_usd: float
    avg_cost_per_request_usd: float
    classifier_distribution: dict[str, int]


class RequestMetric(BaseModel):
    timestamp: float = Field(default_factory=time.time)
    query_length: int
    complexity: ComplexityLevel
    classifier_used: str
    classification_confidence: float
    model_used: str
    latency_ms: float
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int
    estimated_cost_usd: float


class HealthResponse(BaseModel):
    status: str = "healthy"
    version: str
    classifier_mode: str
    system1_model: str
    system2_model: str
