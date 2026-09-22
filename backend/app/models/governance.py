"""
PLOT360 Backend — Governance ORM Models
RoR (Record of Rights), Registrations, Encumbrances, Mortgages, and Disputes.
"""
from sqlalchemy import Column, String, Float, DateTime, Boolean, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class RoRRecord(Base):
    """
    Record of Rights (RoR / Jamabandi / 7/12 / Khatian).
    Section 22: Must support configurable / state-specific terminology and fields.
    """
    __tablename__ = "ror_records"

    id = Column(Integer, primary_key=True, index=True)
    parcel_id = Column(Integer, ForeignKey("parcels.id", ondelete="CASCADE"), nullable=False, index=True)
    ulpin = Column(String(50), nullable=False, index=True)

    record_number = Column(String(100), nullable=False)     # e.g. Khata No., Khewat No.
    owner_name = Column(String(200), nullable=False)
    rights_type = Column(String(100), nullable=True)        # Owner, Tenant, Cultivator, Mortgagee
    rights = Column(Text, nullable=True)                   # Full rights description
    land_type = Column(String(100), nullable=True)          # Agricultural, Barani, Chahi, Gair Mumkin
    area = Column(String(50), nullable=True)                # e.g. "0.31 Acre" / "1248.50 m²"
    jurisdiction = Column(String(100), nullable=True)
    status = Column(String(50), default="Verified")         # Verified, Provisional, Under Dispute
    verification_status = Column(String(50), default="VERIFIED")
    source_department = Column(String(200), default="Department of Revenue & Land Records")
    source_record_id = Column(String(100), nullable=True)
    last_updated = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    parcel = relationship("Parcel", back_populates="ror_records")


class Registration(Base):
    """
    Deed / Transaction Registration record from Sub-Registrar Office.
    Section 23: Supports full transaction workflow status.
    """
    __tablename__ = "registrations"

    id = Column(Integer, primary_key=True, index=True)
    parcel_id = Column(Integer, ForeignKey("parcels.id", ondelete="CASCADE"), nullable=False, index=True)
    ulpin = Column(String(50), nullable=False, index=True)

    registration_id = Column(String(100), nullable=False, unique=True, index=True)
    transaction_type = Column(String(100), nullable=False)  # Sale Deed, Gift Deed, Lease, Partition
    registration_date = Column(String(50), nullable=True)
    parties = Column(Text, nullable=True)                  # Buyer/Seller / Transferor/Transferee
    consideration_amount = Column(String(50), nullable=True)
    stamp_duty_paid = Column(String(50), nullable=True)
    status = Column(String(50), default="REGISTERED")       # SUBMITTED, DOCUMENTS_RECEIVED, VERIFICATION, DEPARTMENT_PROCESSING, REGISTERED, REJECTED, PENDING
    record_status = Column(String(50), default="ACTIVE")
    source = Column(String(200), default="Sub-Registrar Office (Inspector General of Registration)")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    parcel = relationship("Parcel", back_populates="registrations")


class Encumbrance(Base):
    """
    Encumbrance / Charge record.
    Section 25: CLEAR / NO_RECORDED_ITEM, ACTIVE, REQUIRES_REVIEW, NOT_AVAILABLE.
    """
    __tablename__ = "encumbrances"

    id = Column(Integer, primary_key=True, index=True)
    parcel_id = Column(Integer, ForeignKey("parcels.id", ondelete="CASCADE"), nullable=False, index=True)
    ulpin = Column(String(50), nullable=False, index=True)

    status = Column(String(50), default="CLEAR")           # CLEAR / ACTIVE / REQUIRES_REVIEW / NOT_AVAILABLE
    institution = Column(String(200), nullable=True)       # Bank / NBFC name
    loan_amount = Column(String(50), nullable=True)
    noc_required = Column(Boolean, default=False)
    reference = Column(String(100), nullable=True)
    start_date = Column(String(50), nullable=True)
    end_date = Column(String(50), nullable=True)
    source = Column(String(200), default="Central Registry / SRO")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    parcel = relationship("Parcel", back_populates="encumbrances")


class Mortgage(Base):
    """Specific Mortgage lien record."""
    __tablename__ = "mortgages"

    id = Column(Integer, primary_key=True, index=True)
    parcel_id = Column(Integer, ForeignKey("parcels.id", ondelete="CASCADE"), nullable=False, index=True)
    ulpin = Column(String(50), nullable=False, index=True)

    mortgagee = Column(String(200), nullable=False)        # Lending Bank
    amount = Column(String(50), nullable=True)
    status = Column(String(50), default="ACTIVE")          # ACTIVE / DISCHARGED / PENDING
    deed_reference = Column(String(100), nullable=True)
    registered_on = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    parcel = relationship("Parcel", back_populates="mortgages")


class Dispute(Base):
    """
    Legal disputes / revenue court cases for a parcel.
    Section 26: dispute_id, parcel, category, filed_date, status, current_stage, responsible_authority.
    """
    __tablename__ = "disputes"

    id = Column(Integer, primary_key=True, index=True)
    parcel_id = Column(Integer, ForeignKey("parcels.id", ondelete="CASCADE"), nullable=False, index=True)
    ulpin = Column(String(50), nullable=False, index=True)

    dispute_id = Column(String(100), nullable=False, unique=True, index=True)
    category = Column(String(100), nullable=False)         # Title Dispute, Boundary Conflict, Inheritance, Tenancy
    filed_date = Column(String(50), nullable=True)
    status = Column(String(50), default="PENDING")         # PENDING / UNDER_TRIAL / DISMISSED / RESOLVED
    current_stage = Column(String(100), nullable=True)      # Arguments, Evidence, Notice Issued
    responsible_authority = Column(String(200), nullable=True)  # Sub-Divisional Magistrate / Civil Court
    last_updated = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    parcel = relationship("Parcel", back_populates="disputes")
