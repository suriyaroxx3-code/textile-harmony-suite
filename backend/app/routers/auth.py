"""
Very small login endpoint for the demo.

Passwords are stored as SHA-256 hashes (see seed.py). This is enough to show
the request/response flow to students; a production app would use a proper
password hasher (bcrypt/argon2) and issue JWT or session tokens.
"""
import hashlib

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/api/auth", tags=["Auth"])


def hash_password(raw: str) -> str:
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


@router.post("/login", response_model=schemas.LoginOut)
def login(body: schemas.LoginIn, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == body.username).first()
    if user is None or user.password_hash != hash_password(body.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return schemas.LoginOut(ok=True, username=user.username, display_name=user.display_name)
