"""
PLOT360 Backend — Auth & User Pydantic Schemas
"""
from typing import Optional, List
from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    username: str # email or username
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    refresh_token: str
    expires_in: int
    user: "UserOut"


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class PermissionOut(BaseModel):
    code: str
    label: Optional[str] = None
    category: Optional[str] = None

    class Config:
        from_attributes = True


class RoleOut(BaseModel):
    id: int
    name: str
    label: Optional[str] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True


class UserOut(BaseModel):
    id: int
    email: str
    username: Optional[str] = None
    full_name: Optional[str] = None
    department: Optional[str] = None
    information_classification: Optional[str] = "PUBLIC"
    roles: List[str] = []
    permissions: List[str] = []

    class Config:
        from_attributes = True
