from typing import List
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.crud import crud_forms
from app.schemas.forms import BookingCreate, BookingResponse, StatusUpdate

router = APIRouter()

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_booking(
    booking_in: BookingCreate,
    db: Session = Depends(deps.get_db)
):
    """
    Submit a new booking request.
    """
    booking = crud_forms.create_booking(db=db, booking_in=booking_in)
    return {
        "message": "تم استلام طلب الحجز بنجاح",
        "booking_ref": booking.booking_ref
    }

@router.get("/", response_model=List[BookingResponse])
def get_bookings(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.RoleChecker(["super_admin", "admin", "receptionist", "doctor", "viewer"]))
):
    """
    Get all bookings (Admin only).
    """
    bookings = crud_forms.get_bookings(db=db, skip=skip, limit=limit)
    return bookings

@router.put("/{booking_id}/status", response_model=BookingResponse)
def update_booking_status(
    booking_id: str,
    status_update: StatusUpdate,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.RoleChecker(["super_admin", "admin", "receptionist"]))
):
    """
    Update booking status (e.g., confirmed, cancelled).
    """
    booking = crud_forms.update_booking_status(db=db, booking_id=booking_id, status=status_update.status)
    if not booking:
        raise HTTPException(status_code=404, detail="الحجز غير موجود")
    return booking

@router.delete("/{booking_id}")
def delete_booking(
    booking_id: str,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.RoleChecker(["super_admin", "admin"]))
):
    """
    Delete a booking.
    """
    booking = crud_forms.delete_booking(db=db, booking_id=booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="الحجز غير موجود")
    return {"message": "تم حذف الحجز بنجاح"}
