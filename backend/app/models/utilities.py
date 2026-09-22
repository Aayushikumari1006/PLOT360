"""
PLOT360 Backend — Utilities and Infrastructure ORM Models
Sections 34 & 35: Utility connections (electricity, water, sewer, gas) and infrastructure networks.
"""
from sqlalchemy import Column, String, Float, DateTime, Boolean, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
from app.utils.geo import get_geometry_column


class UtilityRecord(Base):
    """
    Utility connection status for a parcel.
    Statuses: CONNECTED / AVAILABLE_NEARBY / NOT_AVAILABLE / UNKNOWN.
    """
    __tablename__ = "utilities"

    id = Column(Integer, primary_key=True, index=True)
    parcel_id = Column(Integer, ForeignKey("parcels.id", ondelete="CASCADE"), nullable=False, index=True)
    ulpin = Column(String(50), nullable=False, index=True)

    electricity = Column(String(100), default="CONNECTED")  # e.g. "Connected (Meter #99210)"
    water = Column(String(100), default="CONNECTED")        # e.g. "Connected (Connection #4412)"
    sewer = Column(String(100), default="CONNECTED")        # e.g. "Connected"
    gas = Column(String(100), default="AVAILABLE_NEARBY")   # e.g. "Available Nearby"
    telecom = Column(String(100), default="CONNECTED")
    other = Column(String(100), nullable=True)

    source = Column(String(200), default="Municipal Utilities Board / DISCOM")
    last_updated = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    parcel = relationship("Parcel", back_populates="utility_records")


class Infrastructure(Base):
    """
    Nearby and connected infrastructure networks (roads, water mains, power lines, drainage).
    Section 35: Spatial GeoJSON infrastructure layers.
    """
    __tablename__ = "infrastructure"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    network_type = Column(String(100), nullable=False)     # Road, Water, Drainage, Electricity, Telecom
    sub_type = Column(String(100), nullable=True)          # Arterial Road, Primary Drain, 11kV Feeder
    jurisdiction = Column(String(100), nullable=True)
    geometry = get_geometry_column("POLYGON", 4326)
    status = Column(String(50), default="Operational")     # Operational / Planned / Under Construction
    capacity = Column(String(100), nullable=True)
    authority = Column(String(200), nullable=True)
    source = Column(String(100), default="DEMO_SAMPLE_DATA")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
