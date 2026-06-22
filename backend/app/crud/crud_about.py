from sqlalchemy.orm import Session
from app.models.about import CMSAbout
from app.schemas.about import CMSAboutUpdate, CMSAboutCreate
from typing import Optional

def get_about(db: Session) -> Optional[CMSAbout]:
    return db.query(CMSAbout).first()

def create_about(db: Session, obj_in: CMSAboutCreate) -> CMSAbout:
    db_obj = CMSAbout(**obj_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_about(db: Session, obj_in: CMSAboutUpdate) -> CMSAbout:
    db_obj = db.query(CMSAbout).first()
    if not db_obj:
        return create_about(db, CMSAboutCreate(**obj_in.model_dump()))
    
    update_data = obj_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
