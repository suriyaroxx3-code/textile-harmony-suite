from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import crud, models, schemas
from ..database import get_db

router = APIRouter(prefix="/api/stock", tags=["Inventory"])


@router.get("", response_model=list[schemas.StockOut])
def list_stock(db: Session = Depends(get_db)):
    return db.query(models.StockItem).order_by(models.StockItem.id).all()


@router.get("/low", response_model=list[schemas.StockOut])
def low_stock(db: Session = Depends(get_db)):
    """Items whose quantity has dropped below their minimum threshold."""
    return (
        db.query(models.StockItem)
        .filter(models.StockItem.qty < models.StockItem.min)
        .order_by(models.StockItem.id)
        .all()
    )


@router.post("", response_model=schemas.StockOut, status_code=201)
def create_stock(body: schemas.StockCreate, db: Session = Depends(get_db)):
    return crud.create(db, models.StockItem, body)


@router.get("/{item_id}", response_model=schemas.StockOut)
def get_stock(item_id: int, db: Session = Depends(get_db)):
    return crud.get_or_404(db, models.StockItem, item_id)


@router.put("/{item_id}", response_model=schemas.StockOut)
def update_stock(item_id: int, body: schemas.StockUpdate, db: Session = Depends(get_db)):
    obj = crud.get_or_404(db, models.StockItem, item_id)
    return crud.update(db, obj, body)


@router.delete("/{item_id}", status_code=204)
def delete_stock(item_id: int, db: Session = Depends(get_db)):
    crud.delete(db, crud.get_or_404(db, models.StockItem, item_id))
