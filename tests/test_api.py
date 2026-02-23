import pytest
from unittest.mock import AsyncMock

from app.api.dependencies import get_router, get_settings
from app.config import Settings
from app.models import ComplexityLevel, RouteResponse


def make_test_settings():
    return Settings(
        api_key="test-key",
        classifier_mode="heuristic",
    )


@pytest.mark.asyncio
async def test_health_endpoint(client, app):
    app.dependency_overrides[get_settings] = make_test_settings
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data
    assert data["classifier_mode"] == "heuristic"


@pytest.mark.asyncio
async def test_metrics_endpoint_empty(client):
    response = await client.get("/metrics")
    assert response.status_code == 200
    data = response.json()
    assert data["total_requests"] == 0


@pytest.mark.asyncio
async def test_route_endpoint(client, app):
    mock_router = AsyncMock()
    mock_router.route.return_value = RouteResponse(
        answer="Hello there!",
        model_used="gpt-4o-mini",
        complexity=ComplexityLevel.SYSTEM1,
        classification_confidence=0.85,
        classifier_used="heuristic",
        latency_ms=150.0,
        token_usage={"prompt_tokens": 50, "completion_tokens": 100, "total_tokens": 150},
        estimated_cost_usd=0.0000675,
    )
    app.dependency_overrides[get_router] = lambda: mock_router

    response = await client.post("/route", json={"query": "Hello!"})
    assert response.status_code == 200
    data = response.json()
    assert data["answer"] == "Hello there!"
    assert data["model_used"] == "gpt-4o-mini"
    assert data["complexity"] == "system1"


@pytest.mark.asyncio
async def test_route_endpoint_empty_query(client):
    response = await client.post("/route", json={"query": ""})
    assert response.status_code == 422  # Validation error
