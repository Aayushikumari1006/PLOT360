"""
PLOT360 Backend — Document Intelligence & Versioning ORM Models
Sections 17, 52, 53: Document upload, metadata validation, versioning, and OCR extraction.
"""
from sqlalchemy import Column, String, Float, DateTime, Boolean, Integer, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Document(Base):
    """Uploaded document entity with OCR status and metadata."""
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(String(100), unique=True, nullable=False, index=True)
    parcel_id = Column(Integer, ForeignKey("parcels.id", ondelete="SET NULL"), nullable=True, index=True)
    ulpin = Column(String(50), nullable=True, index=True)
    uploaded_by_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    document_type = Column(String(100), nullable=False) # Sale Deed, Mutation Order, Tax Receipt, Building Sanction, Court Order
    filename = Column(String(255), nullable=False)
    storage_uri = Column(String(500), nullable=False)
    file_size_bytes = Column(Integer, nullable=True)
    mime_type = Column(String(100), nullable=True)
    sha256_hash = Column(String(64), nullable=True)

    processing_status = Column(String(50), default="UPLOADED") # UPLOADED / PROCESSING / OCR_COMPLETED / OCR_FAILED
    ocr_text = Column(Text, nullable=True)
    ocr_extracted_fields = Column(JSON, nullable=True)  # { "ulpin": ..., "owner": ..., "area": ... }
    is_ocr_simulated = Column(Boolean, default=False)
    information_classification = Column(String(50), default="AUTHORIZED_DEPARTMENT")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    parcel = relationship("Parcel", back_populates="documents")
    versions = relationship("DocumentVersion", back_populates="document", cascade="all, delete-orphan")


class DocumentVersion(Base):
    """Immutable document revision history."""
    __tablename__ = "document_versions"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    version_number = Column(Integer, nullable=False, default=1)
    storage_uri = Column(String(500), nullable=False)
    file_size_bytes = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    document = relationship("Document", back_populates="versions")
