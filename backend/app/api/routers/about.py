from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.schemas.about import CMSAbout, CMSAboutUpdate, CMSAboutCreate
from app.crud.crud_about import get_about, update_about

router = APIRouter()

@router.get("/", response_model=CMSAbout)
def read_about(db: Session = Depends(get_db)):
    """Get the about page CMS content (Public)."""
    about = get_about(db)
    if not about:
        about = CMSAboutCreate() # return empty
    return about

@router.put("/", response_model=CMSAbout)
def modify_about(about_in: CMSAboutUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Update about page CMS content (Admin only)."""
    return update_about(db, about_in)
