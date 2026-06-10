from sqlalchemy.orm import Session
from app.models.cms import CMSHome, CMSService, CMSDoctor, CMSPackage
from app.schemas.cms import (
    CMSHomeUpdate,
    CMSServiceCreate, CMSServiceUpdate,
    CMSDoctorCreate, CMSDoctorUpdate,
    CMSPackageCreate, CMSPackageUpdate
)

# Helper function to get dict based on pydantic version
def get_dict(obj, exclude_unset=False):
    if hasattr(obj, "model_dump"):
        return obj.model_dump(exclude_unset=exclude_unset)
    return obj.dict(exclude_unset=exclude_unset)

# --- CMS Home ---

def get_home_content(db: Session) -> CMSHome:
    home = db.query(CMSHome).first()
    if not home:
        home = CMSHome()
        db.add(home)
        db.commit()
        db.refresh(home)
    return home

def update_home_content(db: Session, update_data: CMSHomeUpdate) -> CMSHome:
    home = get_home_content(db)
    update_dict = get_dict(update_data, exclude_unset=True)
    for field, value in update_dict.items():
        setattr(home, field, value)
    db.commit()
    db.refresh(home)
    return home

# --- CMS Services ---

def get_services(db: Session, skip: int = 0, limit: int = 100):
    return db.query(CMSService).offset(skip).limit(limit).all()

def get_service_by_id(db: Session, service_id: str):
    return db.query(CMSService).filter(CMSService.service_id == service_id).first()

def create_service(db: Session, service_in: CMSServiceCreate):
    db_obj = CMSService(**get_dict(service_in))
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_service(db: Session, service_id: str, update_data: CMSServiceUpdate):
    db_obj = get_service_by_id(db, service_id)
    if db_obj:
        update_dict = get_dict(update_data, exclude_unset=True)
        for field, value in update_dict.items():
            setattr(db_obj, field, value)
        db.commit()
        db.refresh(db_obj)
    return db_obj

def delete_service(db: Session, service_id: str):
    db_obj = get_service_by_id(db, service_id)
    if db_obj:
        db.delete(db_obj)
        db.commit()
    return db_obj

# --- CMS Doctors ---

def get_doctors(db: Session, skip: int = 0, limit: int = 100):
    return db.query(CMSDoctor).offset(skip).limit(limit).all()

def get_doctor_by_id(db: Session, doctor_id: str):
    return db.query(CMSDoctor).filter(CMSDoctor.doctor_id == doctor_id).first()

def create_doctor(db: Session, doctor_in: CMSDoctorCreate):
    db_obj = CMSDoctor(**get_dict(doctor_in))
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_doctor(db: Session, doctor_id: str, update_data: CMSDoctorUpdate):
    db_obj = get_doctor_by_id(db, doctor_id)
    if db_obj:
        update_dict = get_dict(update_data, exclude_unset=True)
        for field, value in update_dict.items():
            setattr(db_obj, field, value)
        db.commit()
        db.refresh(db_obj)
    return db_obj

def delete_doctor(db: Session, doctor_id: str):
    db_obj = get_doctor_by_id(db, doctor_id)
    if db_obj:
        db.delete(db_obj)
        db.commit()
    return db_obj

# --- CMS Packages ---

def get_packages(db: Session, skip: int = 0, limit: int = 100):
    return db.query(CMSPackage).offset(skip).limit(limit).all()

def get_package_by_id(db: Session, package_id: str):
    return db.query(CMSPackage).filter(CMSPackage.package_id == package_id).first()

def create_package(db: Session, package_in: CMSPackageCreate):
    db_obj = CMSPackage(**get_dict(package_in))
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_package(db: Session, package_id: str, update_data: CMSPackageUpdate):
    db_obj = get_package_by_id(db, package_id)
    if db_obj:
        update_dict = get_dict(update_data, exclude_unset=True)
        for field, value in update_dict.items():
            setattr(db_obj, field, value)
        db.commit()
        db.refresh(db_obj)
    return db_obj

def delete_package(db: Session, package_id: str):
    db_obj = get_package_by_id(db, package_id)
    if db_obj:
        db.delete(db_obj)
        db.commit()
    return db_obj
