from sqlalchemy.orm import Session
from app.models.contact_cms import CMSContact
from app.schemas.contact_cms import CMSContactUpdate, CMSContactCreate
from typing import Optional

def get_contact_cms(db: Session) -> Optional[CMSContact]:
    return db.query(CMSContact).first()

def create_contact_cms(db: Session, obj_in: CMSContactCreate) -> CMSContact:
    db_obj = CMSContact(**obj_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_contact_cms(db: Session, obj_in: CMSContactUpdate) -> CMSContact:
    db_obj = db.query(CMSContact).first()
    if not db_obj:
        return create_contact_cms(db, CMSContactCreate(**obj_in.model_dump()))
    
    update_data = obj_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
