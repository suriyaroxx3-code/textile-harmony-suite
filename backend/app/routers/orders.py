from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import crud, models, schemas
from ..database import get_db

router = APIRouter(prefix="/api/orders", tags=["Production - Orders"])

STAGES = ["Receiving", "Sorting", "Packing", "Sealing", "QC", "Dispatch"]


@router.get("", response_model=list[schemas.OrderOut])
def list_orders(db: Session = Depends(get_db)):
    return db.query(models.Order).order_by(models.Order.id.desc()).all()


@router.get("/stages")
def stage_summary(db: Session = Depends(get_db)):
    """How many orders sit in each floor stage - feeds the Floor Summary cards."""
    counts = [0] * len(STAGES)
    for order in db.query(models.Order).all():
        counts[order.stage] += 1
    return [{"stage": name, "count": counts[i]} for i, name in enumerate(STAGES)]


@router.post("", response_model=schemas.OrderOut, status_code=201)
def create_order(body: schemas.OrderCreate, db: Session = Depends(get_db)):
    if db.query(models.Order).filter(models.Order.order_id == body.order_id).first():
        raise HTTPException(status_code=409, detail=f"Order {body.order_id} already exists")
    return crud.create(db, models.Order, body)


@router.get("/{item_id}", response_model=schemas.OrderOut)
def get_order(item_id: int, db: Session = Depends(get_db)):
    return crud.get_or_404(db, models.Order, item_id)


@router.put("/{item_id}", response_model=schemas.OrderOut)
def update_order(item_id: int, body: schemas.OrderUpdate, db: Session = Depends(get_db)):
    obj = crud.get_or_404(db, models.Order, item_id)
    return crud.update(db, obj, body)


@router.delete("/{item_id}", status_code=204)
def delete_order(item_id: int, db: Session = Depends(get_db)):
    crud.delete(db, crud.get_or_404(db, models.Order, item_id))
