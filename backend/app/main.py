"""
BrushPack API — FastAPI entry point.

Run from the `backend/` folder:
    uvicorn app.main:app --reload --port 8000

Interactive docs: http://localhost:8000/docs
"""
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, SessionLocal, engine
from .routers import auth, batches, billing, contractors, orders, reports, stock, workers
from .seed import seed_if_empty


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Create tables (if missing) and load demo rows once at startup.
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_if_empty(db)
    yield


app = FastAPI(
    title="BrushPack API",
    description="CRUD backend for the BrushPack packaging-operations dashboard.",
    version="1.0.0",
    lifespan=lifespan,
)

# Allow the Vite dev server (and any origin listed in CORS_ORIGINS) to call us.
origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:8080,http://localhost:5173,http://localhost:3000",
).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(contractors.router)
app.include_router(workers.router)
app.include_router(batches.router)
app.include_router(orders.router)
app.include_router(billing.router)
app.include_router(stock.router)
app.include_router(reports.router)


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "service": "BrushPack API", "docs": "/docs"}
