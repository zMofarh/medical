from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.crud import crud_cms
from app.schemas.cms import CMSServiceCreate, CMSServiceUpdate, CMSServiceResponse

router = APIRouter()

@router.get("/", response_model=List[CMSServiceResponse])
def get_services(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db)
):
    """
    Get all services (Public).
    """
    return crud_cms.get_services(db=db, skip=skip, limit=limit)

@router.get("/{service_id}", response_model=CMSServiceResponse)
def get_service(
    service_id: str,
    db: Session = Depends(deps.get_db)
):
    """
    Get a specific service by ID (Public).
    """
    service = crud_cms.get_service_by_id(db=db, service_id=service_id)
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")
    return service

@router.post("/", response_model=CMSServiceResponse, status_code=status.HTTP_201_CREATED)
def create_service(
    service_in: CMSServiceCreate,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.RoleChecker(["super_admin", "admin", "editor"]))
):
    """
    Create a new service (Admin/Editor).
    """
    # Check if exists
    if crud_cms.get_service_by_id(db=db, service_id=service_in.service_id):
        raise HTTPException(status_code=400, detail="Service ID already exists")
    return crud_cms.create_service(db=db, service_in=service_in)

@router.put("/{service_id}", response_model=CMSServiceResponse)
def update_service(
    service_id: str,
    service_in: CMSServiceUpdate,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.RoleChecker(["super_admin", "admin", "editor"]))
):
    """
    Update a service (Admin/Editor).
    """
    service = crud_cms.update_service(db=db, service_id=service_id, update_data=service_in)
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")
    return service

@router.delete("/{service_id}")
def delete_service(
    service_id: str,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.RoleChecker(["super_admin", "admin"]))
):
    """
    Delete a service (Admin only).
    """
    service = crud_cms.delete_service(db=db, service_id=service_id)
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")
    return {"message": "Service deleted successfully"}
