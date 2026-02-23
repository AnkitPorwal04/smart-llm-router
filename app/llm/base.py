from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class LLMResponse:
    content: str
    model: str
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int


class BaseLLMClient(ABC):
    @abstractmethod
    async def generate(
        self,
        query: str,
        system_prompt: str | None = None,
        model: str | None = None,
    ) -> LLMResponse: ...
