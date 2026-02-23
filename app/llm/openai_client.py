from openai import AsyncOpenAI

from app.config import Settings
from app.llm.base import BaseLLMClient, LLMResponse

DEFAULT_SYSTEM_PROMPT = "You are a helpful assistant. Provide clear, accurate, and concise answers."


class OpenAIClient(BaseLLMClient):
    def __init__(self, settings: Settings):
        self.client = AsyncOpenAI(
            api_key=settings.api_key,
            base_url=settings.api_base_url,
        )
        self.settings = settings

    async def generate(
        self,
        query: str,
        system_prompt: str | None = None,
        model: str | None = None,
    ) -> LLMResponse:
        model = model or self.settings.system1_model
        system_prompt = system_prompt or DEFAULT_SYSTEM_PROMPT

        response = await self.client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": query},
            ],
            temperature=0.7,
        )

        choice = response.choices[0]
        usage = response.usage

        return LLMResponse(
            content=choice.message.content,
            model=response.model,
            prompt_tokens=usage.prompt_tokens,
            completion_tokens=usage.completion_tokens,
            total_tokens=usage.total_tokens,
        )
