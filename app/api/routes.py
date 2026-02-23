from fastapi import APIRouter, Depends, HTTPException

from app import __version__
from app.api.dependencies import get_metrics_store, get_router, get_settings
from app.config import Settings
from app.exceptions import SmartRouterError
from app.metrics.store import MetricsStore
from app.models import HealthResponse, MetricsSummary, RouteRequest, RouteResponse
from app.router.router import SmartRouter

router = APIRouter()


@router.post("/route", response_model=RouteResponse)
async def route_query(
    request: RouteRequest,
    smart_router: SmartRouter = Depends(get_router),
):
    """Classify the query, route to the appropriate model, and return the response."""
    try:
        return await smart_router.route(request)
    except SmartRouterError as exc:
        raise HTTPException(status_code=502, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Internal error: {exc}")


@router.get("/metrics", response_model=MetricsSummary)
async def get_metrics(
    metrics_store: MetricsStore = Depends(get_metrics_store),
):
    """Return aggregated metrics across all requests."""
    return metrics_store.get_summary()


@router.get("/health", response_model=HealthResponse)
async def health_check(
    settings: Settings = Depends(get_settings),
):
    """Health check endpoint with configuration summary."""
    return HealthResponse(
        status="healthy",
        version=__version__,
        classifier_mode=settings.classifier_mode,
        system1_model=settings.system1_model,
        system2_model=settings.system2_model,
    )
