from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import crud, models, schemas
from ..database import get_db

router = APIRouter(prefix="/api/billing", tags=["Billing"])


@router.get("", response_model=list[schemas.BillingOut])
def list_billing(db: Session = Depends(get_db)):
    return db.query(models.BillingRecord).order_by(models.BillingRecord.id.desc()).all()


@router.post("", response_model=schemas.BillingOut, status_code=201)
def create_billing(body: schemas.BillingCreate, db: Session = Depends(get_db)):
    if db.query(models.BillingRecord).filter(models.BillingRecord.ref == body.ref).first():
        raise HTTPException(status_code=409, detail=f"Reference {body.ref} already exists")
    return crud.create(db, models.BillingRecord, body)


@router.get("/{item_id}", response_model=schemas.BillingOut)
def get_billing(item_id: int, db: Session = Depends(get_db)):
    return crud.get_or_404(db, models.BillingRecord, item_id)


@router.put("/{item_id}", response_model=schemas.BillingOut)
def update_billing(item_id: int, body: schemas.BillingUpdate, db: Session = Depends(get_db)):
    obj = crud.get_or_404(db, models.BillingRecord, item_id)
    return crud.update(db, obj, body)


@router.delete("/{item_id}", status_code=204)
def delete_billing(item_id: int, db: Session = Depends(get_db)):
    crud.delete(db, crud.get_or_404(db, models.BillingRecord, item_id))
