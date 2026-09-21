"""
ORM models — one class per database table.

Each module of the BrushPack UI maps to one table here:
  Workforce   -> Contractor, Worker
  Production  -> Batch, Order
  Billing     -> BillingRecord
  Inventory   -> StockItem
  Auth        -> User
"""
from datetime import date

from sqlalchemy import Boolean, Date, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(64))
    display_name: Mapped[str] = mapped_column(String(100), default="Manager")


class Contractor(Base):
    __tablename__ = "contractors"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    area: Mapped[str] = mapped_column(String(100))
    workers: Mapped[int] = mapped_column(Integer, default=0)
    amount: Mapped[float] = mapped_column(Float, default=0)
    status: Mapped[str] = mapped_column(String(20), default="Pending")  # Pending | Paid


class Worker(Base):
    __tablename__ = "workers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    emp_id: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(100))
    role: Mapped[str] = mapped_column(String(50))
    hours: Mapped[float] = mapped_column(Float, default=0)
    rate: Mapped[float] = mapped_column(Float, default=0)
    present: Mapped[bool] = mapped_column(Boolean, default=False)


class Batch(Base):
    """A packing batch: tips received vs units packed."""

    __tablename__ = "batches"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    batch_no: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    product: Mapped[str] = mapped_column(String(120))
    received: Mapped[int] = mapped_column(Integer, default=0)
    packed: Mapped[int] = mapped_column(Integer, default=0)
    entry_date: Mapped[date] = mapped_column(Date, default=date.today)


class Order(Base):
    """A client order moving through the 6 floor stages (0..5)."""

    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    order_id: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    client: Mapped[str] = mapped_column(String(100))
    product: Mapped[str] = mapped_column(String(120))
    qty: Mapped[int] = mapped_column(Integer, default=0)
    stage: Mapped[int] = mapped_column(Integer, default=0)


class BillingRecord(Base):
    """Quotations (type='quote') and invoices (type='bill') share one table."""

    __tablename__ = "billing_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    ref: Mapped[str] = mapped_column(String(30), unique=True, index=True)  # Q-0105 / INV-2026-0184
    contractor: Mapped[str] = mapped_column(String(100))
    date: Mapped[str] = mapped_column(String(10))  # ISO yyyy-mm-dd, kept as text for simplicity
    value: Mapped[float] = mapped_column(Float, default=0)
    status: Mapped[str] = mapped_column(String(20), default="Draft")  # Draft|Sent|Pending|Accepted|Received
    type: Mapped[str] = mapped_column(String(10), default="quote")  # quote | bill


class StockItem(Base):
    __tablename__ = "stock_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    cat: Mapped[str] = mapped_column(String(50))  # Cardboard | Plastic | Supplies
    qty: Mapped[int] = mapped_column(Integer, default=0)
    unit: Mapped[str] = mapped_column(String(20), default="pcs")
    min: Mapped[int] = mapped_column(Integer, default=0)
