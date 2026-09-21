from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import crud, models, schemas
from ..database import get_db

router = APIRouter(prefix="/api/workers", tags=["Workers"])


@router.get("", response_model=list[schemas.WorkerOut])
def list_workers(db: Session = Depends(get_db)):
    return db.query(models.Worker).order_by(models.Worker.id).all()


@router.post("", response_model=schemas.WorkerOut, status_code=201)
def create_worker(body: schemas.WorkerCreate, db: Session = Depends(get_db)):
    if db.query(models.Worker).filter(models.Worker.emp_id == body.emp_id).first():
        raise HTTPException(status_code=409, detail=f"Employee ID {body.emp_id} already exists")
    return crud.create(db, models.Worker, body)


@router.get("/{item_id}", response_model=schemas.WorkerOut)
def get_worker(item_id: int, db: Session = Depends(get_db)):
    return crud.get_or_404(db, models.Worker, item_id)


@router.put("/{item_id}", response_model=schemas.WorkerOut)
def update_worker(item_id: int, body: schemas.WorkerUpdate, db: Session = Depends(get_db)):
    obj = crud.get_or_404(db, models.Worker, item_id)
    return crud.update(db, obj, body)


@router.delete("/{item_id}", status_code=204)
def delete_worker(item_id: int, db: Session = Depends(get_db)):
    crud.delete(db, crud.get_or_404(db, models.Worker, item_id))
