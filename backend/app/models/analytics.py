"""
PLOT360 Backend — Analytics and KPI ORM Models
Section 23 & 82: Aggregations for development hotspots, workflow volume, and data health metrics.
"""
from sqlalchemy import Column, String, Float, DateTime, Integer, JSON
from sqlalchemy.sql import func
from app.database import Base


class AnalyticsSnapshot(Base):
    """Periodic or real-time analytics aggregation snapshot."""
    __tablename__ = "analytics_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    snapshot_key = Column(String(100), unique=True, nullable=False, index=True) # e.g. "KPI_GLOBAL", "HOTSPOTS_CHANDIGARH"
    category = Column(String(100), nullable=False) # overview / governance / citizen / ai / health
    metrics_data = Column(JSON, nullable=False)
    time_period = Column(String(50), default="Current")
    data_basis = Column(String(200), default="PLOT360 Unified Land Database")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
