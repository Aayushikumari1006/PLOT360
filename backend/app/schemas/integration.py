"""
PLOT360 Backend — Integration Hub Schemas
"""
from typing import Optional, List
from pydantic import BaseModel


class ApiConnectionOut(BaseModel):
    id: int
    connection_id: str
    name: str
    department: str
    version: str
    status: str
    is_simulated: bool
    last_sync: Optional[str] = None
    next_sync: Optional[str] = None
    records_synced: int
    errors_count: int
    auth_status: str
    latency_ms: int

    class Config:
        from_attributes = True


class SyncJobOut(BaseModel):
    job_id: str
    connection_id: str
    department: str
    status: str
    progress: int
    records_processed: int
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
