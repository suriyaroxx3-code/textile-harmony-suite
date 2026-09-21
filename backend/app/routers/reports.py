"""
Read-only aggregate endpoints that power the Dashboard and Weekly Report.
These compute their numbers from the CRUD tables, so anything students add
through the UI shows up here immediately.
"""
from datetime import date, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/api/reports", tags=["Reports"])

DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]


def weekly_points(db: Session) -> list[schemas.WeeklyPoint]:
    """Received vs packed totals for Mon..Sun of the current week."""
    today = date.today()
    monday = today - timedelta(days=today.weekday())
    totals = {i: {"received": 0, "packed": 0} for i in range(7)}

    rows = (
        db.query(models.Batch)
        .filter(models.Batch.entry_date >= monday, models.Batch.entry_date <= monday + timedelta(days=6))
        .all()
    )
    for b in rows:
        idx = b.entry_date.weekday()
        totals[idx]["received"] += b.received
        totals[idx]["packed"] += b.packed

    return [schemas.WeeklyPoint(d=DAY_LABELS[i], **totals[i]) for i in range(7)]


@router.get("/weekly", response_model=list[schemas.WeeklyPoint])
def weekly_report(db: Session = Depends(get_db)):
    return weekly_points(db)


@router.get("/dashboard", response_model=schemas.DashboardSummary)
def dashboard_summary(db: Session = Depends(get_db)):
    today = date.today()

    packed_today = sum(
        b.packed for b in db.query(models.Batch).filter(models.Batch.entry_date == today).all()
    )

    workers = db.query(models.Worker).all()
    present = sum(1 for w in workers if w.present)

    pending_bills = (
        db.query(models.BillingRecord)
        .filter(models.BillingRecord.status.in_(["Sent", "Pending"]))
        .all()
    )

    low_stock = (
        db.query(models.StockItem).filter(models.StockItem.qty < models.StockItem.min).count()
    )

    return schemas.DashboardSummary(
        units_packed_today=packed_today,
        workers_present=present,
        workers_total=len(workers),
        pending_bills_value=sum(b.value for b in pending_bills),
        pending_bills_count=len(pending_bills),
        low_stock_count=low_stock,
        trend=weekly_points(db),
    )
