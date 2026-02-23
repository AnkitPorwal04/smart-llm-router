from abc import ABC, abstractmethod

from app.models import ClassificationResult


class BaseClassifier(ABC):
    @abstractmethod
    async def classify(self, query: str) -> ClassificationResult: ...

    @property
    @abstractmethod
    def name(self) -> str: ...
