from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.schemas.contact_cms import CMSContact, CMSContactUpdate, CMSContactCreate
from app.crud.crud_contact_cms import get_contact_cms, update_contact_cms

router = APIRouter()

@router.get("/", response_model=CMSContact)
def read_contact_cms(db: Session = Depends(get_db)):
    """Get the contact page CMS content (Public)."""
    contact_cms = get_contact_cms(db)
    if not contact_cms:
        contact_cms = CMSContactCreate()
    return contact_cms

@router.put("/", response_model=CMSContact)
def modify_contact_cms(cms_in: CMSContactUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Update contact page CMS content (Admin only)."""
    return update_contact_cms(db, cms_in)
