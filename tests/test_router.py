import pytest
from unittest.mock import AsyncMock, MagicMock

from app.config import Settings
from app.llm.base import LLMResponse
from app.metrics.store import MetricsStore
from app.models import ClassificationResult, ComplexityLevel, RouteRequest
from app.router.router import SmartRouter


def make_settings(**overrides):
    defaults = {
        "api_key": "test-key",
        "system1_model": "gpt-4o-mini",
        "system2_model": "gpt-4o",
        "fallback_to_system2": True,
    }
    defaults.update(overrides)
    return Settings(**defaults)


def make_llm_response(model="gpt-4o-mini"):
    return LLMResponse(
        content="Test answer",
        model=model,
        prompt_tokens=50,
        completion_tokens=100,
        total_tokens=150,
    )


@pytest.fixture
def settings():
    return make_settings()


@pytest.fixture
def mock_classifier():
    classifier = AsyncMock()
    classifier.name = "heuristic"
    classifier.classify.return_value = ClassificationResult(
        complexity=ComplexityLevel.SYSTEM1,
        confidence=0.85,
        reasoning="test",
        classifier_used="heuristic",
    )
    return classifier


@pytest.fixture
def mock_llm_client():
    client = AsyncMock()
    client.generate.return_value = make_llm_response()
    return client


@pytest.fixture
def metrics_store():
    return MetricsStore()


@pytest.fixture
def router(mock_classifier, mock_llm_client, metrics_store, settings):
    return SmartRouter(
        classifier=mock_classifier,
        llm_client=mock_llm_client,
        metrics_store=metrics_store,
        settings=settings,
    )


@pytest.mark.asyncio
async def test_system1_routes_to_fast_model(router, mock_llm_client):
    request = RouteRequest(query="Hello!")
    response = await router.route(request)

    mock_llm_client.generate.assert_called_once_with(
        query="Hello!",
        system_prompt=None,
        model="gpt-4o-mini",
    )
    assert response.complexity == ComplexityLevel.SYSTEM1


@pytest.mark.asyncio
async def test_system2_routes_to_advanced_model(router, mock_classifier, mock_llm_client):
    mock_classifier.classify.return_value = ClassificationResult(
        complexity=ComplexityLevel.SYSTEM2,
        confidence=0.9,
        reasoning="complex",
        classifier_used="heuristic",
    )
    mock_llm_client.generate.return_value = make_llm_response("gpt-4o")

    request = RouteRequest(query="Write a merge sort implementation")
    response = await router.route(request)

    mock_llm_client.generate.assert_called_once_with(
        query="Write a merge sort implementation",
        system_prompt=None,
        model="gpt-4o",
    )
    assert response.complexity == ComplexityLevel.SYSTEM2


@pytest.mark.asyncio
async def test_force_model_overrides_classification(router, mock_llm_client):
    mock_llm_client.generate.return_value = make_llm_response("gpt-4o")

    request = RouteRequest(query="Hello!", force_model="gpt-4o")
    response = await router.route(request)

    mock_llm_client.generate.assert_called_once_with(
        query="Hello!",
        system_prompt=None,
        model="gpt-4o",
    )


@pytest.mark.asyncio
async def test_metrics_are_recorded(router, metrics_store):
    request = RouteRequest(query="Hello!")
    await router.route(request)

    summary = metrics_store.get_summary()
    assert summary.total_requests == 1


@pytest.mark.asyncio
async def test_response_includes_latency(router):
    request = RouteRequest(query="Hello!")
    response = await router.route(request)
    assert response.latency_ms > 0


@pytest.mark.asyncio
async def test_response_includes_token_usage(router):
    request = RouteRequest(query="Hello!")
    response = await router.route(request)
    assert response.token_usage["total_tokens"] == 150
