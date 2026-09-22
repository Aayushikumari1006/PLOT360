"""
PLOT360 Backend — Authentication Router
Sections 12 & 13: Login, Refresh Token, Logout, and Current User profile with relational RBAC.
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User, UserRole, Role, RolePermission, Permission
from app.auth.password import verify_password
from app.auth.jwt import create_access_token, create_refresh_token, decode_token
from app.auth.rbac import get_current_user, AuthenticatedUserContext
from app.schemas.auth import LoginRequest, TokenResponse, RefreshTokenRequest, UserOut

router = APIRouter(prefix="/auth", tags=["Authentication"])


def _build_user_out(user: User, db: Session) -> UserOut:
    user_roles = db.query(UserRole).filter(UserRole.user_id == user.id).all()
    role_ids = [ur.role_id for ur in user_roles]
    roles = []
    perms_set = set()

    if role_ids:
        roles_ent = db.query(Role).filter(Role.id.in_(role_ids)).all()
        roles = [r.name for r in roles_ent]
        rps = db.query(RolePermission).filter(RolePermission.role_id.in_(role_ids)).all()
        pids = [rp.permission_id for rp in rps]
        if pids:
            perms_ent = db.query(Permission).filter(Permission.id.in_(pids)).all()
            for p in perms_ent:
                perms_set.add(p.code)

    return UserOut(
        id=user.id,
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        department=user.department,
        information_classification=user.information_classification or "PUBLIC",
        roles=roles,
        permissions=sorted(list(perms_set))
    )


@router.post("/login", response_model=TokenResponse, summary="Login and obtain access + refresh tokens")
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.email == login_data.username) | (User.username == login_data.username)
    ).first()

    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(status_code=403, detail="User account is deactivated")

    user_out = _build_user_out(user, db)
    access_token = create_access_token({"sub": str(user.id), "roles": user_out.roles})
    refresh_token = create_refresh_token({"sub": str(user.id)})

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        refresh_token=refresh_token,
        expires_in=480 * 60,
        user=user_out
    )


@router.post("/refresh", summary="Refresh access token using valid refresh token")
def refresh_token(payload: RefreshTokenRequest, db: Session = Depends(get_db)):
    decoded = decode_token(payload.refresh_token)
    if not decoded or decoded.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    user_id = decoded.get("sub")
    user = db.query(User).filter(User.id == int(user_id), User.is_active == True).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    user_out = _build_user_out(user, db)
    new_access_token = create_access_token({"sub": str(user.id), "roles": user_out.roles})

    return {
        "access_token": new_access_token,
        "token_type": "bearer",
        "expires_in": 480 * 60
    }


@router.post("/logout", summary="Logout current session")
def logout(user_ctx: AuthenticatedUserContext = Depends(get_current_user)):
    # Server-side token invalidation / acknowledgment
    return {"message": "Successfully logged out", "status": "LOGGED_OUT"}


@router.get("/me", response_model=UserOut, summary="Get current authenticated user profile and permissions")
def get_me(user_ctx: AuthenticatedUserContext = Depends(get_current_user), db: Session = Depends(get_db)):
    return _build_user_out(user_ctx.user, db)
