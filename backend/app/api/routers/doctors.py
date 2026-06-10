from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.crud import crud_cms
from app.schemas.cms import CMSDoctorCreate, CMSDoctorUpdate, CMSDoctorResponse

router = APIRouter()

@router.get("/", response_model=List[CMSDoctorResponse])
def get_doctors(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db)
):
    """
    Get all doctors (Public).
    """
    return crud_cms.get_doctors(db=db, skip=skip, limit=limit)

@router.get("/{doctor_id}", response_model=CMSDoctorResponse)
def get_doctor(
    doctor_id: str,
    db: Session = Depends(deps.get_db)
):
    """
    Get a specific doctor by ID (Public).
    """
    doctor = crud_cms.get_doctor_by_id(db=db, doctor_id=doctor_id)
    if not doctor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found")
    return doctor

@router.post("/", response_model=CMSDoctorResponse, status_code=status.HTTP_201_CREATED)
def create_doctor(
    doctor_in: CMSDoctorCreate,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.RoleChecker(["super_admin", "admin", "editor"]))
):
    """
    Create a new doctor (Admin/Editor).
    """
    if crud_cms.get_doctor_by_id(db=db, doctor_id=doctor_in.doctor_id):
        raise HTTPException(status_code=400, detail="Doctor ID already exists")
    return crud_cms.create_doctor(db=db, doctor_in=doctor_in)

@router.put("/{doctor_id}", response_model=CMSDoctorResponse)
def update_doctor(
    doctor_id: str,
    doctor_in: CMSDoctorUpdate,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.RoleChecker(["super_admin", "admin", "editor"]))
):
    """
    Update a doctor (Admin/Editor).
    """
    doctor = crud_cms.update_doctor(db=db, doctor_id=doctor_id, update_data=doctor_in)
    if not doctor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found")
    return doctor

@router.delete("/{doctor_id}")
def delete_doctor(
    doctor_id: str,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.RoleChecker(["super_admin", "admin"]))
):
    """
    Delete a doctor (Admin only).
    """
    doctor = crud_cms.delete_doctor(db=db, doctor_id=doctor_id)
    if not doctor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found")
    return {"message": "Doctor deleted successfully"}
