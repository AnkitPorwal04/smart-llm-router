import time

from app.classifier.base import BaseClassifier
from app.config import Settings
from app.exceptions import RoutingError
from app.llm.openai_client import OpenAIClient
from app.metrics.collector import MetricsCollector
from app.metrics.store import MetricsStore
from app.models import (
    ClassificationResult,
    ComplexityLevel,
    RouteRequest,
    RouteResponse,
)


class SmartRouter:
    """Core routing engine: Classify -> Select Model -> Generate -> Record Metrics."""

    def __init__(
        self,
        classifier: BaseClassifier,
        llm_client: OpenAIClient,
        metrics_store: MetricsStore,
        settings: Settings,
    ):
        self.classifier = classifier
        self.llm_client = llm_client
        self.metrics_store = metrics_store
        self.settings = settings

    def _select_model(self, classification: ClassificationResult, force_model: str | None) -> str:
        if force_model:
            return force_model
        if classification.complexity == ComplexityLevel.SYSTEM2:
            return self.settings.system2_model
        return self.settings.system1_model

    async def route(self, request: RouteRequest) -> RouteResponse:
        start_time = time.perf_counter()

        # Step 1: Classify
        classification = await self.classifier.classify(request.query)

        # Step 2: Select model
        model = self._select_model(classification, request.force_model)

        # Step 3: Generate response
        try:
            llm_response = await self.llm_client.generate(
                query=request.query,
                system_prompt=request.system_prompt,
                model=model,
            )
        except Exception as exc:
            if self.settings.fallback_to_system2 and model == self.settings.system1_model:
                fallback_model = self.settings.system2_model
                llm_response = await self.llm_client.generate(
                    query=request.query,
                    system_prompt=request.system_prompt,
                    model=fallback_model,
                )
                model = fallback_model
            else:
                raise RoutingError(f"LLM generation failed: {exc}") from exc

        # Step 4: Calculate latency
        latency_ms = round((time.perf_counter() - start_time) * 1000, 2)

        # Step 5: Record metrics
        metric = MetricsCollector.build_metric(
            query=request.query,
            classification=classification,
            llm_response=llm_response,
            latency_ms=latency_ms,
            model_pricing=self.settings.model_pricing,
        )
        self.metrics_store.record(metric)

        # Step 6: Return response
        return RouteResponse(
            answer=llm_response.content,
            model_used=model,
            complexity=classification.complexity,
            classification_confidence=classification.confidence,
            classifier_used=classification.classifier_used,
            latency_ms=latency_ms,
            token_usage={
                "prompt_tokens": llm_response.prompt_tokens,
                "completion_tokens": llm_response.completion_tokens,
                "total_tokens": llm_response.total_tokens,
            },
            estimated_cost_usd=metric.estimated_cost_usd,
        )
