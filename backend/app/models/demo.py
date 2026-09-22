"""
PLOT360 Backend — Demo / Presentation Session ORM Model
Section 66 & 94: Persistent demo session state covering the 15 sequence stages.
"""
from sqlalchemy import Column, String, Integer, DateTime, JSON, Boolean
from sqlalchemy.sql import func
from app.database import Base


class DemoSession(Base):
    """
    Persistent demo / presentation session entity.
    Tracks target parcel/location, current step in 15-stage sequence, and completion state.
    """
    __tablename__ = "demo_sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), unique=True, nullable=False, index=True)
    target_ulpin = Column(String(50), nullable=False, index=True)
    target_parcel_id = Column(String(50), nullable=True)
    location_id = Column(String(50), nullable=False, default="chandigarh")
    location_name = Column(String(100), nullable=False, default="Chandigarh")

    current_step = Column(Integer, nullable=False, default=1)
    total_steps = Column(Integer, nullable=False, default=15)
    status = Column(String(50), nullable=False, default="ACTIVE")  # ACTIVE / COMPLETED / RESET
    is_completed = Column(Boolean, default=False)

    step_history = Column(JSON, nullable=True)  # List of completed steps with timestamps
    metadata_context = Column(JSON, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
