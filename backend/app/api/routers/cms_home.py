from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.crud import crud_cms
from app.schemas.cms import CMSHomeUpdate, CMSHomeResponse

router = APIRouter()

@router.get("/", response_model=CMSHomeResponse)
def get_home_content(db: Session = Depends(deps.get_db)):
    """
    Get home page content (Public).
    """
    return crud_cms.get_home_content(db=db)

@router.put("/", response_model=CMSHomeResponse)
def update_home_content(
    update_data: CMSHomeUpdate,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.RoleChecker(["super_admin", "admin", "editor"]))
):
    """
    Update home page content (Admin/Editor).
    """
    return crud_cms.update_home_content(db=db, update_data=update_data)
