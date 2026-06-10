from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from app.api import deps
from app.core import security
from app.crud import crud_user
from app.schemas.token import Token
from app.schemas.user import UserResponse
from app.models.user import User

router = APIRouter()

@router.post("/login", response_model=Token)
def login(
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    user = crud_user.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="البريد الإلكتروني أو كلمة المرور غير صحيحة",
        )
    elif not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="الحساب غير نشط",
        )
    
    # Update last login
    user.last_login = datetime.now(timezone.utc)
    db.add(user)
    db.commit()
    
    # Create access token
    access_token = security.create_access_token(
        data={"sub": user.email}
    )
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/me", response_model=UserResponse)
def get_current_user_info(
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Get current logged in user details.
    """
    return current_user

@router.get("/test-super-admin")
def test_super_admin(
    current_user: User = Depends(deps.RoleChecker(["super_admin"]))
):
    """
    Test endpoint only accessible by super_admin role.
    """
    return {"message": "You are a super admin!", "user": current_user.email}
