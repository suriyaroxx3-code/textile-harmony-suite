"""
Run from backend/:  pytest -q
Uses an isolated SQLite file so it never touches brushpack.db.
"""
import os

os.environ["DATABASE_URL"] = "sqlite:///./test_brushpack.db"

import pytest
from fastapi.testclient import TestClient

from app.database import engine
from app.main import app


@pytest.fixture(scope="module")
def client():
    if os.path.exists("test_brushpack.db"):
        os.remove("test_brushpack.db")
    with TestClient(app) as c:
        yield c
    engine.dispose()  # release the SQLite file handle (needed on Windows) before deleting
    if os.path.exists("test_brushpack.db"):
        os.remove("test_brushpack.db")


def test_health(client):
    assert client.get("/").json()["status"] == "ok"


def test_login(client):
    ok = client.post("/api/auth/login", json={"username": "manager", "password": "admin123"})
    assert ok.status_code == 200 and ok.json()["ok"] is True
    bad = client.post("/api/auth/login", json={"username": "manager", "password": "nope"})
    assert bad.status_code == 401


def test_contractor_crud(client):
    created = client.post("/api/contractors", json={"name": "Test Co", "area": "Line 9", "workers": 3, "amount": 1000})
    assert created.status_code == 201
    cid = created.json()["id"]

    updated = client.put(f"/api/contractors/{cid}", json={"status": "Paid"})
    assert updated.json()["status"] == "Paid"

    assert client.get(f"/api/contractors/{cid}").status_code == 200
    assert client.delete(f"/api/contractors/{cid}").status_code == 204
    assert client.get(f"/api/contractors/{cid}").status_code == 404


def test_seed_populates_every_table(client):
    for path in ["/api/contractors", "/api/workers", "/api/batches", "/api/orders", "/api/billing", "/api/stock"]:
        assert len(client.get(path).json()) > 0, path


def test_duplicate_employee_id_rejected(client):
    r = client.post("/api/workers", json={"emp_id": "EMP001", "name": "Dup", "role": "Packer"})
    assert r.status_code == 409


def test_reports(client):
    weekly = client.get("/api/reports/weekly").json()
    assert [p["d"] for p in weekly] == ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    summary = client.get("/api/reports/dashboard").json()
    assert summary["workers_total"] >= summary["workers_present"]
    assert summary["low_stock_count"] == len(client.get("/api/stock/low").json())
