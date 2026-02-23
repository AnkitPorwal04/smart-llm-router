import threading
from collections import defaultdict

from app.models import MetricsSummary, RequestMetric


class MetricsStore:
    def __init__(self):
        self._metrics: list[RequestMetric] = []
        self._lock = threading.Lock()

    def record(self, metric: RequestMetric) -> None:
        with self._lock:
            self._metrics.append(metric)

    def get_summary(self) -> MetricsSummary:
        with self._lock:
            metrics = list(self._metrics)

        if not metrics:
            return MetricsSummary(
                total_requests=0,
                requests_by_complexity={},
                requests_by_model={},
                avg_latency_ms=0.0,
                total_tokens_used=0,
                total_estimated_cost_usd=0.0,
                avg_cost_per_request_usd=0.0,
                classifier_distribution={},
            )

        total = len(metrics)
        requests_by_complexity: dict[str, int] = defaultdict(int)
        requests_by_model: dict[str, int] = defaultdict(int)
        classifier_distribution: dict[str, int] = defaultdict(int)
        total_latency = 0.0
        total_tokens = 0
        total_cost = 0.0

        for m in metrics:
            requests_by_complexity[m.complexity.value] += 1
            requests_by_model[m.model_used] += 1
            classifier_distribution[m.classifier_used] += 1
            total_latency += m.latency_ms
            total_tokens += m.total_tokens
            total_cost += m.estimated_cost_usd

        return MetricsSummary(
            total_requests=total,
            requests_by_complexity=dict(requests_by_complexity),
            requests_by_model=dict(requests_by_model),
            avg_latency_ms=round(total_latency / total, 2),
            total_tokens_used=total_tokens,
            total_estimated_cost_usd=round(total_cost, 6),
            avg_cost_per_request_usd=round(total_cost / total, 6),
            classifier_distribution=dict(classifier_distribution),
        )

    def get_recent(self, n: int = 100) -> list[RequestMetric]:
        with self._lock:
            return list(self._metrics[-n:])

    def clear(self) -> None:
        with self._lock:
            self._metrics.clear()
