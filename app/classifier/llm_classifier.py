import json

from openai import AsyncOpenAI

from app.classifier.base import BaseClassifier
from app.config import Settings
from app.models import ClassificationResult, ComplexityLevel

CLASSIFICATION_PROMPT = """You are a query complexity classifier. Analyze the user's query and determine if it requires:
- "system1": Simple, factual, or routine (greetings, lookups, definitions, translations, simple Q&A)
- "system2": Complex reasoning, analysis, coding, math, multi-step problems, creative writing, detailed explanations

Respond with ONLY valid JSON:
{"complexity": "system1" or "system2", "confidence": 0.0-1.0, "reasoning": "brief explanation"}"""


class LLMClassifier(BaseClassifier):
    def __init__(self, settings: Settings):
        self.client = AsyncOpenAI(
            api_key=settings.api_key,
            base_url=settings.api_base_url,
        )
        self.model = settings.classifier_model

    @property
    def name(self) -> str:
        return "llm"

    async def classify(self, query: str) -> ClassificationResult:
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": CLASSIFICATION_PROMPT},
                {"role": "user", "content": query},
            ],
            temperature=0.0,
            max_tokens=150,
            response_format={"type": "json_object"},
        )

        result = json.loads(response.choices[0].message.content)

        complexity = (
            ComplexityLevel.SYSTEM2
            if result["complexity"] == "system2"
            else ComplexityLevel.SYSTEM1
        )

        return ClassificationResult(
            complexity=complexity,
            confidence=float(result.get("confidence", 0.8)),
            reasoning=result.get("reasoning", ""),
            classifier_used=self.name,
        )
