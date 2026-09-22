"""
PLOT360 Backend — Ownership & Ownership History ORM Models
Preserves current and immutable historical ownership transitions (Section 24).
"""
from sqlalchemy import Column, String, Float, DateTime, Boolean, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Ownership(Base):
    """Current ownership / rights-holder record for a parcel."""
    __tablename__ = "ownership"

    id = Column(Integer, primary_key=True, index=True)
    parcel_id = Column(Integer, ForeignKey("parcels.id", ondelete="CASCADE"), nullable=False, index=True)
    ulpin = Column(String(50), nullable=False, index=True)

    owner_name = Column(String(200), nullable=False)
    owner_relation = Column(String(100), nullable=True)  # "s/o Harbhajan Singh"
    share_percent = Column(String(30), nullable=True, default="100%")
    ownership_type = Column(String(100), default="Freehold")  # Freehold / Leasehold / Joint / Co-ownership
    verified = Column(Boolean, default=True)
    is_current = Column(Boolean, default=True)

    # Privacy preservation: never store raw Aadhaar/PAN, store masked or hash
    id_type = Column(String(50), nullable=True)
    id_masked = Column(String(50), nullable=True)

    source = Column(String(100), default="DEMO_SAMPLE_DATA")
    source_record_id = Column(String(100), nullable=True)
    last_updated = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    parcel = relationship("Parcel", back_populates="ownership_records")


class OwnershipHistory(Base):
    """
    Immutable historical record of ownership changes.
    Section 24: Historical transitions must be preserved. Do not overwrite history.
    """
    __tablename__ = "ownership_history"

    id = Column(Integer, primary_key=True, index=True)
    parcel_id = Column(Integer, ForeignKey("parcels.id", ondelete="CASCADE"), nullable=False, index=True)
    ulpin = Column(String(50), nullable=False, index=True)

    previous_state = Column(Text, nullable=False)       # JSON or string representation of former owner
    new_state = Column(Text, nullable=False)            # JSON or string representation of new owner
    transaction_type = Column(String(100), nullable=True) # Sale Deed, Inheritance, Gift Deed, Court Order
    deed_number = Column(String(100), nullable=True)
    source = Column(String(100), default="Sub-Registrar Office")
    record_reference = Column(String(100), nullable=True)
    effective_date = Column(String(50), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
