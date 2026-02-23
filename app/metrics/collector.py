import time

from app.llm.base import LLMResponse
from app.models import ClassificationResult, RequestMetric


class MetricsCollector:
    @staticmethod
    def calculate_cost(
        model: str,
        prompt_tokens: int,
        completion_tokens: int,
        model_pricing: dict,
    ) -> float:
        pricing = model_pricing.get(model, {"input": 0.0, "output": 0.0})
        input_cost = (prompt_tokens / 1_000_000) * pricing["input"]
        output_cost = (completion_tokens / 1_000_000) * pricing["output"]
        return round(input_cost + output_cost, 8)

    @staticmethod
    def build_metric(
        query: str,
        classification: ClassificationResult,
        llm_response: LLMResponse,
        latency_ms: float,
        model_pricing: dict,
    ) -> RequestMetric:
        cost = MetricsCollector.calculate_cost(
            model=llm_response.model,
            prompt_tokens=llm_response.prompt_tokens,
            completion_tokens=llm_response.completion_tokens,
            model_pricing=model_pricing,
        )
        return RequestMetric(
            timestamp=time.time(),
            query_length=len(query),
            complexity=classification.complexity,
            classifier_used=classification.classifier_used,
            classification_confidence=classification.confidence,
            model_used=llm_response.model,
            latency_ms=latency_ms,
            prompt_tokens=llm_response.prompt_tokens,
            completion_tokens=llm_response.completion_tokens,
            total_tokens=llm_response.total_tokens,
            estimated_cost_usd=cost,
        )
