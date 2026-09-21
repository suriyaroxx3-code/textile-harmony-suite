"""
Pydantic schemas — the shapes of request bodies and responses.

Convention per resource:
  XCreate  -> body for POST
  XUpdate  -> body for PUT (all fields optional, only send what changed)
  XOut     -> response (includes id)
"""
from datetime import date

from pydantic import BaseModel, ConfigDict, Field


# ---------- Auth ----------
class LoginIn(BaseModel):
    username: str
    password: str


class LoginOut(BaseModel):
    ok: bool
    username: str
    display_name: str


# ---------- Contractors ----------
class ContractorBase(BaseModel):
    name: str
    area: str
    workers: int = 0
    amount: float = 0
    status: str = "Pending"


class ContractorCreate(ContractorBase):
    pass


class ContractorUpdate(BaseModel):
    name: str | None = None
    area: str | None = None
    workers: int | None = None
    amount: float | None = None
    status: str | None = None


class ContractorOut(ContractorBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ---------- Workers ----------
class WorkerBase(BaseModel):
    emp_id: str
    name: str
    role: str
    hours: float = 0
    rate: float = 0
    present: bool = False


class WorkerCreate(WorkerBase):
    pass


class WorkerUpdate(BaseModel):
    emp_id: str | None = None
    name: str | None = None
    role: str | None = None
    hours: float | None = None
    rate: float | None = None
    present: bool | None = None


class WorkerOut(WorkerBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ---------- Batches ----------
class BatchBase(BaseModel):
    batch_no: str
    product: str
    received: int = 0
    packed: int = 0
    entry_date: date = Field(default_factory=date.today)


class BatchCreate(BatchBase):
    pass


class BatchUpdate(BaseModel):
    batch_no: str | None = None
    product: str | None = None
    received: int | None = None
    packed: int | None = None
    entry_date: date | None = None


class BatchOut(BatchBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ---------- Orders ----------
class OrderBase(BaseModel):
    order_id: str
    client: str
    product: str
    qty: int = 0
    stage: int = Field(default=0, ge=0, le=5)


class OrderCreate(OrderBase):
    pass


class OrderUpdate(BaseModel):
    order_id: str | None = None
    client: str | None = None
    product: str | None = None
    qty: int | None = None
    stage: int | None = Field(default=None, ge=0, le=5)


class OrderOut(OrderBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ---------- Billing ----------
class BillingBase(BaseModel):
    ref: str
    contractor: str
    date: str
    value: float = 0
    status: str = "Draft"
    type: str = "quote"


class BillingCreate(BillingBase):
    pass


class BillingUpdate(BaseModel):
    ref: str | None = None
    contractor: str | None = None
    date: str | None = None
    value: float | None = None
    status: str | None = None
    type: str | None = None


class BillingOut(BillingBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ---------- Stock ----------
class StockBase(BaseModel):
    name: str
    cat: str
    qty: int = 0
    unit: str = "pcs"
    min: int = 0


class StockCreate(StockBase):
    pass


class StockUpdate(BaseModel):
    name: str | None = None
    cat: str | None = None
    qty: int | None = None
    unit: str | None = None
    min: int | None = None


class StockOut(StockBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ---------- Reports / Dashboard ----------
class WeeklyPoint(BaseModel):
    d: str
    received: int
    packed: int


class DashboardSummary(BaseModel):
    units_packed_today: int
    workers_present: int
    workers_total: int
    pending_bills_value: float
    pending_bills_count: int
    low_stock_count: int
    trend: list[WeeklyPoint]
