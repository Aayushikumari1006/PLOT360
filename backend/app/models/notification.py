"""
PLOT360 Backend — Notifications ORM Model
Sections 21 & 45: Persistent notifications for service submission, workflow advances,
conflict assignments, AI alerts, and field verifications.
"""
from sqlalchemy import Column, String, DateTime, Boolean, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Notification(Base):
    """User notifications with priority and read state."""
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(100), default="INFO") # SERVICE_REQUEST / WORKFLOW / CONFLICT / AI_ALERT / VERIFICATION / SYSTEM
    priority = Column(String(30), default="NORMAL")         # LOW / NORMAL / HIGH / CRITICAL
    is_read = Column(Boolean, default=False, index=True)

    related_ulpin = Column(String(50), nullable=True, index=True)
    related_entity_type = Column(String(50), nullable=True) # service_request / conflict / ai_alert / parcel
    related_entity_id = Column(String(100), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    user = relationship("User", back_populates="notifications")
