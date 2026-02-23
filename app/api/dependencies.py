from functools import lru_cache

from app.classifier.base import BaseClassifier
from app.classifier.heuristic import HeuristicClassifier
from app.classifier.hybrid import HybridClassifier
from app.classifier.llm_classifier import LLMClassifier
from app.config import Settings, get_settings
from app.llm.openai_client import OpenAIClient
from app.metrics.store import MetricsStore
from app.router.router import SmartRouter

_metrics_store = MetricsStore()


@lru_cache
def get_classifier() -> BaseClassifier:
    settings = get_settings()
    mode = settings.classifier_mode.lower()
    if mode == "llm":
        return LLMClassifier(settings)
    elif mode == "hybrid":
        return HybridClassifier(settings)
    else:
        return HeuristicClassifier()


@lru_cache
def get_llm_client() -> OpenAIClient:
    return OpenAIClient(get_settings())


def get_metrics_store() -> MetricsStore:
    return _metrics_store


@lru_cache
def get_router() -> SmartRouter:
    return SmartRouter(
        classifier=get_classifier(),
        llm_client=get_llm_client(),
        metrics_store=get_metrics_store(),
        settings=get_settings(),
    )
