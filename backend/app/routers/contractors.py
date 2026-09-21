from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import crud, models, schemas
from ..database import get_db

router = APIRouter(prefix="/api/contractors", tags=["Contractors"])


@router.get("", response_model=list[schemas.ContractorOut])
def list_contractors(db: Session = Depends(get_db)):
    return db.query(models.Contractor).order_by(models.Contractor.id).all()


@router.post("", response_model=schemas.ContractorOut, status_code=201)
def create_contractor(body: schemas.ContractorCreate, db: Session = Depends(get_db)):
    return crud.create(db, models.Contractor, body)


@router.get("/{item_id}", response_model=schemas.ContractorOut)
def get_contractor(item_id: int, db: Session = Depends(get_db)):
    return crud.get_or_404(db, models.Contractor, item_id)


@router.put("/{item_id}", response_model=schemas.ContractorOut)
def update_contractor(item_id: int, body: schemas.ContractorUpdate, db: Session = Depends(get_db)):
    obj = crud.get_or_404(db, models.Contractor, item_id)
    return crud.update(db, obj, body)


@router.delete("/{item_id}", status_code=204)
def delete_contractor(item_id: int, db: Session = Depends(get_db)):
    crud.delete(db, crud.get_or_404(db, models.Contractor, item_id))
