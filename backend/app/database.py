"""
Database setup — SQLite via SQLAlchemy.

One engine, one SessionLocal factory, and a `get_db` dependency that
FastAPI injects into every route handler that needs a session.
"""
import os
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

# Default DB file lives next to this package (backend/brushpack.db), whatever the cwd is.
BACKEND_DIR = Path(__file__).resolve().parent.parent
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{(BACKEND_DIR / 'brushpack.db').as_posix()}")

# `check_same_thread=False` is required for SQLite when FastAPI runs
# handlers on different threads.
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    """Base class every ORM model inherits from."""


def get_db():
    """FastAPI dependency: yield a session, always close it afterwards."""
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
