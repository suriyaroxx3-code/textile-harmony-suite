from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import crud, models, schemas
from ..database import get_db

router = APIRouter(prefix="/api/batches", tags=["Production - Batches"])


@router.get("", response_model=list[schemas.BatchOut])
def list_batches(db: Session = Depends(get_db)):
    # newest first so the UI table shows the latest entry on top
    return db.query(models.Batch).order_by(models.Batch.id.desc()).all()


@router.post("", response_model=schemas.BatchOut, status_code=201)
def create_batch(body: schemas.BatchCreate, db: Session = Depends(get_db)):
    if db.query(models.Batch).filter(models.Batch.batch_no == body.batch_no).first():
        raise HTTPException(status_code=409, detail=f"Batch {body.batch_no} already exists")
    return crud.create(db, models.Batch, body)


@router.get("/{item_id}", response_model=schemas.BatchOut)
def get_batch(item_id: int, db: Session = Depends(get_db)):
    return crud.get_or_404(db, models.Batch, item_id)


@router.put("/{item_id}", response_model=schemas.BatchOut)
def update_batch(item_id: int, body: schemas.BatchUpdate, db: Session = Depends(get_db)):
    obj = crud.get_or_404(db, models.Batch, item_id)
    return crud.update(db, obj, body)


@router.delete("/{item_id}", status_code=204)
def delete_batch(item_id: int, db: Session = Depends(get_db)):
    crud.delete(db, crud.get_or_404(db, models.Batch, item_id))
