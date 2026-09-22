"""
PLOT360 Backend — Governance & Land Records Schemas
"""
from typing import Optional, List, Any
from pydantic import BaseModel


class RoROut(BaseModel):
    id: int
    ulpin: str
    record_number: str
    owner_name: str
    rights_type: Optional[str] = None
    rights: Optional[str] = None
    land_type: Optional[str] = None
    area: Optional[str] = None
    jurisdiction: Optional[str] = None
    status: Optional[str] = "Verified"
    verification_status: Optional[str] = "VERIFIED"
    source_department: Optional[str] = None
    source_record_id: Optional[str] = None
    last_updated: Optional[str] = None

    class Config:
        from_attributes = True


class RegistrationOut(BaseModel):
    id: int
    ulpin: str
    registration_id: str
    transaction_type: str
    registration_date: Optional[str] = None
    parties: Optional[str] = None
    consideration_amount: Optional[str] = None
    stamp_duty_paid: Optional[str] = None
    status: Optional[str] = "REGISTERED"
    record_status: Optional[str] = "ACTIVE"
    source: Optional[str] = None

    class Config:
        from_attributes = True


class EncumbranceOut(BaseModel):
    id: int
    ulpin: str
    status: str
    institution: Optional[str] = None
    loan_amount: Optional[str] = None
    noc_required: bool = False
    reference: Optional[str] = None
    source: Optional[str] = None

    class Config:
        from_attributes = True


class MortgageOut(BaseModel):
    id: int
    ulpin: str
    mortgagee: str
    amount: Optional[str] = None
    status: str
    deed_reference: Optional[str] = None
    registered_on: Optional[str] = None

    class Config:
        from_attributes = True


class DisputeOut(BaseModel):
    id: int
    ulpin: str
    dispute_id: str
    category: str
    filed_date: Optional[str] = None
    status: str
    current_stage: Optional[str] = None
    responsible_authority: Optional[str] = None
    last_updated: Optional[str] = None

    class Config:
        from_attributes = True


class ProvenanceRecordOut(BaseModel):
    source_department: str
    source_dataset: str
    source_record_id: Optional[str] = None
    version: Optional[str] = "1.0"
    last_updated: Optional[str] = None
    status: Optional[str] = "VERIFIED"
    sync_status: Optional[str] = "Synced"


class LiabilitiesSummaryOut(BaseModel):
    """
    Section 17: Aggregated liabilities resource combining encumbrances, mortgages, disputes.
    """
    parcel_id: str
    ulpin: str
    liability_status: str  # "CLEAR" / "ACTIVE_LIENS" / "DISPUTED"
    total_liabilities_count: int
    active_encumbrances_count: int
    active_mortgages_count: int
    active_disputes_count: int
    encumbrances: List[EncumbranceOut] = []
    mortgages: List[MortgageOut] = []
    disputes: List[DisputeOut] = []
    tax_dues_status: Optional[str] = "PAID"
    legal_advisory: str = "Analytical summary of registered charges. Absence of recorded encumbrance does not constitute legal title warranty."

    class Config:
        from_attributes = True
