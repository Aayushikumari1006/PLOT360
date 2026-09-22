"""
PLOT360 Backend — Common Dependency Injection Exports
"""
from app.database import get_db
from app.auth.rbac import (
    get_current_user,
    get_current_user_optional,
    require_permission,
    require_role,
    AuthenticatedUserContext
)

__all__ = [
    "get_db",
    "get_current_user",
    "get_current_user_optional",
    "require_permission",
    "require_role",
    "AuthenticatedUserContext",
]
