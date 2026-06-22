from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.schemas.search_cms import CMSSearch, CMSSearchUpdate, CMSSearchCreate
from app.crud.crud_search_cms import get_search_cms, update_search_cms

router = APIRouter()

@router.get("/", response_model=CMSSearch)
def read_search_cms(db: Session = Depends(get_db)):
    """Get the search page CMS content (Public)."""
    search_cms = get_search_cms(db)
    if not search_cms:
        search_cms = CMSSearchCreate()
    return search_cms

@router.put("/", response_model=CMSSearch)
def modify_search_cms(cms_in: CMSSearchUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Update search page CMS content (Admin only)."""
    return update_search_cms(db, cms_in)
