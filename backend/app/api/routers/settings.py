from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Any

from app.api import deps
from app.crud.crud_settings import settings
from app.schemas.settings import SystemSettingsPublic, SystemSettingsResponse, SystemSettingsUpdate
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=SystemSettingsPublic)
def read_settings(db: Session = Depends(deps.get_db)) -> Any:
    """
    Get public system settings.
    """
    return settings.get_settings(db)

@router.get("/admin", response_model=SystemSettingsResponse)
def read_settings_admin(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Get all system settings (admin only).
    """
    return settings.get_settings(db)

@router.put("/", response_model=SystemSettingsResponse)
def update_settings(
    *,
    db: Session = Depends(deps.get_db),
    obj_in: SystemSettingsUpdate,
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Update system settings.
    """
    return settings.update_settings(db, obj_in=obj_in)
