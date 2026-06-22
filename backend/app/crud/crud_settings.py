from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder

from app.models.settings import SystemSettings
from app.schemas.settings import SystemSettingsUpdate, SystemSettingsCreate

class CRUDSettings:
    def get_settings(self, db: Session) -> SystemSettings:
        settings = db.query(SystemSettings).first()
        if not settings:
            # Create default settings if none exist
            settings = SystemSettings()
            db.add(settings)
            db.commit()
            db.refresh(settings)
        return settings

    def update_settings(self, db: Session, *, obj_in: SystemSettingsUpdate) -> SystemSettings:
        db_obj = self.get_settings(db)
        obj_data = jsonable_encoder(db_obj)
        update_data = obj_in.dict(exclude_unset=True)
        
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
                
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

settings = CRUDSettings()
