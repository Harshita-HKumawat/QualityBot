import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Get DATABASE_URL from environment (Railway)
# If not found, fallback to local SQLite for testing
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./users.db")

# Create engine
if DATABASE_URL.startswith("sqlite"):
    # ✅ Special setting only for SQLite
    engine = create_engine(
        DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    # ✅ For PostgreSQL (Railway) → no connect_args
    engine = create_engine(DATABASE_URL)

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()
