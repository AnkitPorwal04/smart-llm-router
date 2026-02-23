import os

os.environ.setdefault("API_KEY", "test-key")

import pytest
from httpx import ASGITransport, AsyncClient

from app.api.dependencies import get_metrics_store
from app.main import create_app
from app.metrics.store import MetricsStore


@pytest.fixture
def app():
    return create_app()


@pytest.fixture
def test_metrics_store():
    return MetricsStore()


@pytest.fixture
async def client(app, test_metrics_store):
    app.dependency_overrides[get_metrics_store] = lambda: test_metrics_store
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()
