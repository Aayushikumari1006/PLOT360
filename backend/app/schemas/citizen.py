"""
PLOT360 Backend — Citizen Services & Workflow Schemas
"""
from typing import Optional, List, Any
from pydantic import BaseModel, EmailStr


class ServiceRequestIn(BaseModel):
    service_type: str # demarcation, mutation, noc, ror_copy, building_permission, encumbrance_certificate
    parcel_id: Optional[str] = None
    ulpin: Optional[str] = None
    applicant_name: str
    applicant_phone: Optional[str] = None
    applicant_email: Optional[EmailStr] = None
    notes: Optional[str] = None


class ServiceRequestOut(BaseModel):
    id: int
    request_id: str
    ulpin: Optional[str] = None
    service_type: str
    department: str
    applicant_name: str
    applicant_phone: Optional[str] = None
    applicant_email: Optional[str] = None
    status: str
    current_step: int
    total_steps: int
    notes: Optional[str] = None
    created_at: Optional[Any] = None

    class Config:
        from_attributes = True


class WorkflowTransitionIn(BaseModel):
    to_state: str
    comment: Optional[str] = None
