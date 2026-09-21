"""
Tiny helpers shared by every router so each CRUD route stays 3-5 lines.
"""
from typing import TypeVar

from fastapi import HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from .database import Base

M = TypeVar("M", bound=Base)


def get_or_404(db: Session, model: type[M], item_id: int) -> M:
    obj = db.get(model, item_id)
    if obj is None:
        raise HTTPException(status_code=404, detail=f"{model.__name__} {item_id} not found")
    return obj


def create(db: Session, model: type[M], data: BaseModel) -> M:
    obj = model(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update(db: Session, obj: M, data: BaseModel) -> M:
    # exclude_unset -> only overwrite fields the client actually sent
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(obj, key, value)
    db.commit()
    db.refresh(obj)
    return obj


def delete(db: Session, obj: Base) -> None:
    db.delete(obj)
    db.commit()
