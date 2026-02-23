import pytest

from app.metrics.collector import MetricsCollector
from app.metrics.store import MetricsStore
from app.models import ClassificationResult, ComplexityLevel, RequestMetric
from app.llm.base import LLMResponse


@pytest.fixture
def store():
    return MetricsStore()


def make_metric(**overrides):
    defaults = {
        "query_length": 10,
        "complexity": ComplexityLevel.SYSTEM1,
        "classifier_used": "heuristic",
        "classification_confidence": 0.85,
        "model_used": "gpt-4o-mini",
        "latency_ms": 200.0,
        "prompt_tokens": 50,
        "completion_tokens": 100,
        "total_tokens": 150,
        "estimated_cost_usd": 0.0000675,
    }
    defaults.update(overrides)
    return RequestMetric(**defaults)


def test_empty_store_returns_zero_summary(store):
    summary = store.get_summary()
    assert summary.total_requests == 0
    assert summary.avg_latency_ms == 0.0


def test_record_and_summarize(store):
    store.record(make_metric())
    store.record(make_metric(complexity=ComplexityLevel.SYSTEM2, model_used="gpt-4o"))

    summary = store.get_summary()
    assert summary.total_requests == 2
    assert summary.requests_by_complexity["system1"] == 1
    assert summary.requests_by_complexity["system2"] == 1


def test_avg_latency(store):
    store.record(make_metric(latency_ms=100.0))
    store.record(make_metric(latency_ms=300.0))

    summary = store.get_summary()
    assert summary.avg_latency_ms == 200.0


def test_total_tokens(store):
    store.record(make_metric(total_tokens=100))
    store.record(make_metric(total_tokens=200))

    summary = store.get_summary()
    assert summary.total_tokens_used == 300


def test_get_recent(store):
    for i in range(5):
        store.record(make_metric(latency_ms=float(i)))

    recent = store.get_recent(3)
    assert len(recent) == 3
    assert recent[0].latency_ms == 2.0


def test_clear(store):
    store.record(make_metric())
    store.clear()

    summary = store.get_summary()
    assert summary.total_requests == 0


TEST_PRICING = {
    "gpt-4o-mini": {"input": 0.15, "output": 0.60},
    "gpt-4o": {"input": 2.50, "output": 10.00},
}


def test_cost_calculation():
    cost = MetricsCollector.calculate_cost("gpt-4o-mini", 1_000_000, 1_000_000, TEST_PRICING)
    assert cost == 0.75  # $0.15 input + $0.60 output


def test_build_metric():
    classification = ClassificationResult(
        complexity=ComplexityLevel.SYSTEM1,
        confidence=0.85,
        reasoning="test",
        classifier_used="heuristic",
    )
    llm_response = LLMResponse(
        content="Hello!",
        model="gpt-4o-mini",
        prompt_tokens=50,
        completion_tokens=100,
        total_tokens=150,
    )

    metric = MetricsCollector.build_metric(
        query="Hi",
        classification=classification,
        llm_response=llm_response,
        latency_ms=150.0,
        model_pricing=TEST_PRICING,
    )

    assert metric.model_used == "gpt-4o-mini"
    assert metric.complexity == ComplexityLevel.SYSTEM1
    assert metric.latency_ms == 150.0
    assert metric.total_tokens == 150
