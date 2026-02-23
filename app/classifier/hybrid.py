from app.classifier.base import BaseClassifier
from app.classifier.heuristic import HeuristicClassifier
from app.classifier.llm_classifier import LLMClassifier
from app.config import Settings
from app.models import ClassificationResult


class HybridClassifier(BaseClassifier):
    """Heuristic first; if confidence is low, escalates to LLM classifier."""

    def __init__(self, settings: Settings):
        self.heuristic = HeuristicClassifier()
        self.llm_classifier = LLMClassifier(settings)
        self.confidence_threshold = settings.confidence_threshold

    @property
    def name(self) -> str:
        return "hybrid"

    async def classify(self, query: str) -> ClassificationResult:
        heuristic_result = await self.heuristic.classify(query)

        if heuristic_result.confidence >= self.confidence_threshold:
            heuristic_result.classifier_used = "hybrid/heuristic"
            return heuristic_result

        try:
            llm_result = await self.llm_classifier.classify(query)
            llm_result.classifier_used = "hybrid/llm"
            return llm_result
        except Exception:
            heuristic_result.classifier_used = "hybrid/heuristic_fallback"
            return heuristic_result
