from sqlalchemy.orm import Session
from app.models.search_cms import CMSSearch
from app.schemas.search_cms import CMSSearchUpdate, CMSSearchCreate
from typing import Optional

def get_search_cms(db: Session) -> Optional[CMSSearch]:
    return db.query(CMSSearch).first()

def create_search_cms(db: Session, obj_in: CMSSearchCreate) -> CMSSearch:
    db_obj = CMSSearch(**obj_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_search_cms(db: Session, obj_in: CMSSearchUpdate) -> CMSSearch:
    db_obj = db.query(CMSSearch).first()
    if not db_obj:
        return create_search_cms(db, CMSSearchCreate(**obj_in.model_dump()))
    
    update_data = obj_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
