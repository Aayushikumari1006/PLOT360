"""
PLOT360 Backend — User, Role, Permission, Relational RBAC, and Audit ORM Models
Conforms strictly to Section 11: Proper relational role/permission structures.
"""
from sqlalchemy import Column, String, DateTime, Boolean, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class RolePermission(Base):
    """Many-to-many link between roles and granular permissions."""
    __tablename__ = "role_permissions"

    id = Column(Integer, primary_key=True, index=True)
    role_id = Column(Integer, ForeignKey("roles.id", ondelete="CASCADE"), nullable=False, index=True)
    permission_id = Column(Integer, ForeignKey("permissions.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    role = relationship("Role", back_populates="role_permissions")
    permission = relationship("Permission", back_populates="role_permissions")


class UserRole(Base):
    """Many-to-many link between users and roles."""
    __tablename__ = "user_roles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    role_id = Column(Integer, ForeignKey("roles.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="user_roles")
    role = relationship("Role", back_populates="user_roles")


class Permission(Base):
    """Granular permission entity."""
    __tablename__ = "permissions"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(100), unique=True, nullable=False, index=True)  # e.g. "parcel:read", "ai:review"
    label = Column(String(200), nullable=True)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=True)  # parcel/governance/planning/ai/admin
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    role_permissions = relationship("RolePermission", back_populates="permission", cascade="all, delete-orphan")


class Role(Base):
    """Authoritative Role entity."""
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)  # e.g. "citizen", "revenue_officer"
    label = Column(String(200), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user_roles = relationship("UserRole", back_populates="role", cascade="all, delete-orphan")
    role_permissions = relationship("RolePermission", back_populates="role", cascade="all, delete-orphan")


class User(Base):
    """User account entity with secure password hashing and relational roles."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(200), unique=True, nullable=False, index=True)
    username = Column(String(100), unique=True, nullable=True, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(200), nullable=True)
    is_active = Column(Boolean, default=True)
    is_demo_user = Column(Boolean, default=True)
    department = Column(String(200), nullable=True)
    phone = Column(String(30), nullable=True)
    information_classification = Column(String(50), default="PUBLIC")  # PUBLIC / AUTHORIZED_DEPARTMENT / RESTRICTED / AUDIT_ADMIN

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user_roles = relationship("UserRole", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    service_requests = relationship("ServiceRequest", back_populates="citizen")


class AuditLog(Base):
    """Append-only audit trail for all sensitive mutations — Section 22 & 46."""
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    parcel_id = Column(Integer, ForeignKey("parcels.id", ondelete="SET NULL"), nullable=True, index=True)
    ulpin = Column(String(50), nullable=True, index=True)

    user_id = Column(Integer, nullable=True, index=True)
    user_name = Column(String(200), nullable=True)
    role = Column(String(100), nullable=True)
    action = Column(String(100), nullable=False)  # CREATE / UPDATE / DELETE / TRANSITION / VERIFY / ACTIVATE
    entity = Column(String(100), nullable=True)   # parcel / ror / registration / workflow / ai_alert / conflict
    entity_id = Column(String(100), nullable=True)
    old_value = Column(Text, nullable=True)
    new_value = Column(Text, nullable=True)
    source = Column(String(100), nullable=True)
    request_id = Column(String(100), nullable=True, index=True)
    ip_address = Column(String(50), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    parcel = relationship("Parcel", back_populates="audit_logs")
