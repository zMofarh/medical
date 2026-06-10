from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.crud import crud_cms
from app.schemas.cms import CMSPackageCreate, CMSPackageUpdate, CMSPackageResponse

router = APIRouter()

@router.get("/", response_model=List[CMSPackageResponse])
def get_packages(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db)
):
    """
    Get all packages (Public).
    """
    return crud_cms.get_packages(db=db, skip=skip, limit=limit)

@router.get("/{package_id}", response_model=CMSPackageResponse)
def get_package(
    package_id: str,
    db: Session = Depends(deps.get_db)
):
    """
    Get a specific package by ID (Public).
    """
    package = crud_cms.get_package_by_id(db=db, package_id=package_id)
    if not package:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Package not found")
    return package

@router.post("/", response_model=CMSPackageResponse, status_code=status.HTTP_201_CREATED)
def create_package(
    package_in: CMSPackageCreate,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.RoleChecker(["super_admin", "admin", "editor"]))
):
    """
    Create a new package (Admin/Editor).
    """
    if crud_cms.get_package_by_id(db=db, package_id=package_in.package_id):
        raise HTTPException(status_code=400, detail="Package ID already exists")
    return crud_cms.create_package(db=db, package_in=package_in)

@router.put("/{package_id}", response_model=CMSPackageResponse)
def update_package(
    package_id: str,
    package_in: CMSPackageUpdate,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.RoleChecker(["super_admin", "admin", "editor"]))
):
    """
    Update a package (Admin/Editor).
    """
    package = crud_cms.update_package(db=db, package_id=package_id, update_data=package_in)
    if not package:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Package not found")
    return package

@router.delete("/{package_id}")
def delete_package(
    package_id: str,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.RoleChecker(["super_admin", "admin"]))
):
    """
    Delete a package (Admin only).
    """
    package = crud_cms.delete_package(db=db, package_id=package_id)
    if not package:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Package not found")
    return {"message": "Package deleted successfully"}
