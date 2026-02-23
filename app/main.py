import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app import __version__
from app.api.routes import router
from app.config import get_settings

FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend" / "dist"


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    logging.basicConfig(level=settings.log_level.upper())
    logger = logging.getLogger(__name__)
    logger.info(
        "Smart LLM Router v%s starting | classifier=%s | system1=%s | system2=%s",
        __version__,
        settings.classifier_mode,
        settings.system1_model,
        settings.system2_model,
    )
    yield
    logger.info("Smart LLM Router shutting down")


def create_app() -> FastAPI:
    app = FastAPI(
        title="Smart LLM Router",
        description="Intelligent query routing using System 1/System 2 thinking",
        version=__version__,
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(router)

    if FRONTEND_DIR.exists():
        app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIR / "assets")), name="assets")

        @app.get("/{full_path:path}", include_in_schema=False)
        async def serve_spa(full_path: str):
            file = FRONTEND_DIR / full_path
            if file.is_file():
                return FileResponse(str(file))
            return FileResponse(str(FRONTEND_DIR / "index.html"))

    return app


app = create_app()
