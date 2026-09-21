"""
Demo data so the UI is populated the first time the API starts.

`seed_if_empty()` only inserts rows when a table is empty, so restarting the
server never duplicates data and anything students add is kept.
"""
from datetime import date, timedelta

from sqlalchemy.orm import Session

from . import models
from .routers.auth import hash_password


def seed_if_empty(db: Session) -> None:
    if db.query(models.User).count() == 0:
        db.add(models.User(username="manager", password_hash=hash_password("admin123"), display_name="Manager"))

    if db.query(models.Contractor).count() == 0:
        db.add_all([
            models.Contractor(name="Suresh Pillai", area="Cardboard Packing", workers=18, amount=42000, status="Paid"),
            models.Contractor(name="Meena Rao", area="Plastic Sleeves", workers=14, amount=36500, status="Pending"),
            models.Contractor(name="Arjun Nair", area="Blister Line", workers=11, amount=31000, status="Pending"),
            models.Contractor(name="Kavitha S", area="QC & Dispatch", workers=9, amount=27500, status="Paid"),
        ])

    if db.query(models.Worker).count() == 0:
        db.add_all([
            models.Worker(emp_id="EMP001", name="Ravi Kumar", role="Packer", hours=8, rate=75, present=True),
            models.Worker(emp_id="EMP002", name="Lakshmi Devi", role="Sorter", hours=8, rate=70, present=True),
            models.Worker(emp_id="EMP003", name="Mohan Das", role="QC Inspector", hours=6, rate=90, present=True),
            models.Worker(emp_id="EMP004", name="Priya Shankar", role="Packer", hours=0, rate=75, present=False),
            models.Worker(emp_id="EMP005", name="Karthik Raj", role="Loader", hours=8, rate=65, present=True),
            models.Worker(emp_id="EMP006", name="Anitha M", role="Helper", hours=0, rate=60, present=False),
        ])

    if db.query(models.Batch).count() == 0:
        today = date.today()
        monday = today - timedelta(days=today.weekday())
        week = [
            ("PK-2371", "Round Tip 12mm — Cardboard", 8400, 8200),
            ("PK-2372", "Flat Tip 18mm — Plastic Sleeve", 9600, 9450),
            ("PK-2373", "Angled Tip 10mm — Blister Pack", 8950, 8800),
            ("PK-2374", "Detail Tip 6mm — Cardboard Box", 10400, 10200),
            ("PK-2375", "Fan Tip 25mm — Plastic Sleeve", 11300, 11100),
            ("PK-2376", "Round Tip 12mm — Cardboard", 9900, 9700),
            ("PK-2377", "Flat Tip 18mm — Plastic Sleeve", 5400, 5200),
        ]
        for i, (no, product, received, packed) in enumerate(week):
            db.add(models.Batch(batch_no=no, product=product, received=received, packed=packed,
                                entry_date=monday + timedelta(days=i)))
        db.add_all([
            models.Batch(batch_no="PK-2378", product="Detail Tip 6mm — Cardboard Box", received=1600, packed=1590, entry_date=today),
            models.Batch(batch_no="PK-2379", product="Angled Tip 10mm — Blister Pack", received=3200, packed=3168, entry_date=today),
            models.Batch(batch_no="PK-2380", product="Flat Tip 18mm — Plastic Sleeve", received=1800, packed=1792, entry_date=today),
            models.Batch(batch_no="PK-2381", product="Round Tip 12mm — Cardboard", received=2500, packed=2480, entry_date=today),
        ])

    if db.query(models.Order).count() == 0:
        db.add_all([
            models.Order(order_id="PK-2377", client="Maven Brushes", product="Fan Tip 25mm", qty=900, stage=1),
            models.Order(order_id="PK-2378", client="ColorWorks", product="Detail Tip 6mm", qty=1600, stage=5),
            models.Order(order_id="PK-2379", client="Studio Mart", product="Angled Tip 10mm", qty=3200, stage=4),
            models.Order(order_id="PK-2380", client="ArtPro Supplies", product="Flat Tip 18mm", qty=1800, stage=2),
            models.Order(order_id="PK-2381", client="BrightBrush Co.", product="Round Tip 12mm", qty=2500, stage=3),
        ])

    if db.query(models.BillingRecord).count() == 0:
        db.add_all([
            models.BillingRecord(ref="Q-0102", contractor="Studio Mart", date="2026-05-02", value=38400, status="Accepted", type="quote"),
            models.BillingRecord(ref="Q-0103", contractor="ArtPro Supplies", date="2026-05-05", value=16200, status="Pending", type="quote"),
            models.BillingRecord(ref="Q-0104", contractor="BrightBrush Co.", date="2026-05-08", value=30000, status="Sent", type="quote"),
            models.BillingRecord(ref="INV-2026-0183", contractor="ColorWorks", date="2026-05-06", value=22656, status="Received", type="bill"),
        ])

    if db.query(models.StockItem).count() == 0:
        db.add_all([
            models.StockItem(name="Cardboard Sheets - A4", cat="Cardboard", qty=4200, unit="sheets", min=2000),
            models.StockItem(name="Cardboard Boxes - Small", cat="Cardboard", qty=1100, unit="pcs", min=1500),
            models.StockItem(name="Plastic Sleeves - Clear 12mm", cat="Plastic", qty=8400, unit="pcs", min=3000),
            models.StockItem(name="Blister Cards - 18mm", cat="Plastic", qty=920, unit="pcs", min=1500),
            models.StockItem(name="Printed Labels (Roll)", cat="Supplies", qty=32, unit="rolls", min=20),
            models.StockItem(name="Sealing Tape - 48mm", cat="Supplies", qty=14, unit="rolls", min=30),
            models.StockItem(name="Hot Glue Sticks", cat="Supplies", qty=540, unit="pcs", min=200),
        ])

    db.commit()
