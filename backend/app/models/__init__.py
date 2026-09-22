"""
PLOT360 Backend — Models Package Init
Exposes all ORM models for SQLAlchemy and Alembic schema discovery.
"""
from app.models.parcel import Parcel, Location, Jurisdiction
from app.models.ownership import Ownership, OwnershipHistory
from app.models.governance import RoRRecord, Registration, Encumbrance, Mortgage, Dispute
from app.models.planning import PlanningRecord, BuildingPermission, Restriction
from app.models.taxation import PropertyTax, ValuationReference
from app.models.utilities import UtilityRecord, Infrastructure
from app.models.workflow import (
    WorkflowTemplate, WorkflowInstance, WorkflowStep, WorkflowEvent,
    ServiceRequest, Application
)
from app.models.documents import Document, DocumentVersion
from app.models.user import User, Role, Permission, UserRole, RolePermission, AuditLog
from app.models.notification import Notification
from app.models.ai_models import (
    AIDataset, AIDatasetItem, TemporalPair, AIModel, SatelliteObservation,
    ChangeEvent, AIAlert, AIReview, DataConflict, DuplicateCandidate, Job
)
from app.models.config_model import StateConfig, StateFieldMapping, DataSource, ApiConnection
from app.models.analytics import AnalyticsSnapshot
from app.models.demo import DemoSession

__all__ = [
    "Parcel", "Location", "Jurisdiction",
    "Ownership", "OwnershipHistory",
    "RoRRecord", "Registration", "Encumbrance", "Mortgage", "Dispute",
    "PlanningRecord", "BuildingPermission", "Restriction",
    "PropertyTax", "ValuationReference",
    "UtilityRecord", "Infrastructure",
    "WorkflowTemplate", "WorkflowInstance", "WorkflowStep", "WorkflowEvent",
    "ServiceRequest", "Application",
    "Document", "DocumentVersion",
    "User", "Role", "Permission", "UserRole", "RolePermission", "AuditLog",
    "Notification",
    "AIDataset", "AIDatasetItem", "AIModel", "SatelliteObservation",
    "ChangeEvent", "AIAlert", "AIReview", "DataConflict", "DuplicateCandidate", "Job",
    "StateConfig", "StateFieldMapping", "DataSource", "ApiConnection",
    "AnalyticsSnapshot", "DemoSession",
]

