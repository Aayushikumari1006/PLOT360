"""
PLOT360 Backend — Property Tax, Valuation Reference ORM Models
Sections 33 & 37: Property tax status and valuation references with explicit analytical classifications.
"""
from sqlalchemy import Column, String, Float, DateTime, Boolean, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class PropertyTax(Base):
    """Property tax assessment and payment status."""
    __tablename__ = "property_tax"

    id = Column(Integer, primary_key=True, index=True)
    parcel_id = Column(Integer, ForeignKey("parcels.id", ondelete="CASCADE"), nullable=False, index=True)
    ulpin = Column(String(50), nullable=False, index=True)

    assessment_id = Column(String(100), nullable=False, unique=True, index=True)
    status = Column(String(50), default="PAID")            # PAID / PENDING / OVERDUE / NOT_AVAILABLE
    amount_paid = Column(String(50), nullable=True)        # e.g. "₹ 18,400"
    annual_demand = Column(String(50), nullable=True)
    last_payment = Column(String(50), nullable=True)
    due_date = Column(String(50), nullable=True)
    receipt_no = Column(String(100), nullable=True)
    source = Column(String(200), default="Municipal Corporation Property Tax Cell")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    parcel = relationship("Parcel", back_populates="tax_records")


class ValuationReference(Base):
    """
    Circle rate, guideline value, and analytical market estimate references.
    Section 37: Analytical estimates must be classified explicitly as INDICATIVE_ANALYTICAL_ESTIMATE.
    """
    __tablename__ = "valuation_references"

    id = Column(Integer, primary_key=True, index=True)
    parcel_id = Column(Integer, ForeignKey("parcels.id", ondelete="CASCADE"), nullable=False, index=True)
    ulpin = Column(String(50), nullable=False, index=True)

    reference_type = Column(String(100), nullable=False)   # Circle Rate / Market Benchmark / Analytical Estimate
    reference_value = Column(Float, nullable=False)        # Per unit value or total value
    unit = Column(String(50), default="₹/sq_m")
    jurisdiction = Column(String(100), nullable=True)
    classification = Column(String(100), default="INDICATIVE_ANALYTICAL_ESTIMATE") # INDICATIVE_ANALYTICAL_ESTIMATE or STATUTORY_CIRCLE_RATE
    source = Column(String(200), default="Department of Stamp & Registration / Analytical Benchmark")
    effective_date = Column(String(50), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    parcel = relationship("Parcel", back_populates="valuation_references")
