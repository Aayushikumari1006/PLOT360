"""
PLOT360 Backend — Relational RBAC Authorization Dependencies
Section 15: Server-side authorization enforcement.
Never trusts frontend role selector; inspects authenticated user's relational permissions.
"""
from typing import List, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.auth.jwt import decode_token
from app.models.user import User, UserRole, Role, RolePermission, Permission

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


class AuthenticatedUserContext:
    """Wrapper holding User ORM entity, list of role names, and set of permission codes."""
    def __init__(self, user: User, roles: List[str], permissions: set):
        self.user = user
        self.id = user.id
        self.email = user.email
        self.username = user.username or user.email
        self.full_name = user.full_name
        self.department = user.department
        self.roles = roles
        self.permissions = permissions
        self.information_classification = user.information_classification or "PUBLIC"

    def has_permission(self, permission_code: str) -> bool:
        if "admin:manage_users" in self.permissions or "administrator" in self.roles:
            return True
        return permission_code in self.permissions

    def has_role(self, role_name: str) -> bool:
        if "administrator" in self.roles:
            return True
        return role_name in self.roles


def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> AuthenticatedUserContext:
    """FastAPI dependency: resolves Bearer token to AuthenticatedUserContext."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not token:
        # For development / demo mode when unauthenticated, resolve to demo citizen or raise 401
        raise credentials_exception

    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise credentials_exception

    user_id = payload.get("sub")
    if not user_id:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id), User.is_active == True).first()
    if not user:
        raise credentials_exception

    # Load relational roles and permissions
    user_roles = db.query(UserRole).filter(UserRole.user_id == user.id).all()
    role_ids = [ur.role_id for ur in user_roles]

    roles = []
    permission_codes = set()

    if role_ids:
        roles_entities = db.query(Role).filter(Role.id.in_(role_ids)).all()
        roles = [r.name for r in roles_entities]

        role_perms = db.query(RolePermission).filter(RolePermission.role_id.in_(role_ids)).all()
        perm_ids = [rp.permission_id for rp in role_perms]
        if perm_ids:
            perms = db.query(Permission).filter(Permission.id.in_(perm_ids)).all()
            for p in perms:
                permission_codes.add(p.code)

    return AuthenticatedUserContext(user=user, roles=roles, permissions=permission_codes)


def get_current_user_optional(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> Optional[AuthenticatedUserContext]:
    """FastAPI dependency: returns AuthenticatedUserContext if token provided and valid, else None."""
    if not token:
        return None
    try:
        return get_current_user(token, db)
    except HTTPException:
        return None


def require_permission(required_perm: str):
    """Factory dependency: enforces that the user possesses a specific permission."""
    def dependency(user_ctx: AuthenticatedUserContext = Depends(get_current_user)):
        if not user_ctx.has_permission(required_perm):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission denied: Missing required permission '{required_perm}'"
            )
        return user_ctx
    return dependency


def require_role(required_role: str):
    """Factory dependency: enforces that the user possesses a specific role."""
    def dependency(user_ctx: AuthenticatedUserContext = Depends(get_current_user)):
        if not user_ctx.has_role(required_role):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied: Missing required role '{required_role}'"
            )
        return user_ctx
    return dependency
