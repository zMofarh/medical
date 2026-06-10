from typing import List
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.crud import crud_forms
from app.schemas.forms import ContactMessageCreate, ContactMessageResponse, StatusUpdate

router = APIRouter()

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_contact(
    message_in: ContactMessageCreate,
    db: Session = Depends(deps.get_db)
):
    """
    Submit a new contact message.
    """
    msg = crud_forms.create_contact_message(db=db, message_in=message_in)
    return {"message": "تم إرسال رسالتك بنجاح", "id": str(msg.id)}

@router.get("/", response_model=List[ContactMessageResponse])
def get_contacts(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.RoleChecker(["super_admin", "admin", "receptionist", "viewer"]))
):
    """
    Get all contact messages (Admin only).
    """
    messages = crud_forms.get_contact_messages(db=db, skip=skip, limit=limit)
    return messages

@router.put("/{message_id}/status", response_model=ContactMessageResponse)
def update_contact_status(
    message_id: str,
    status_update: StatusUpdate,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.RoleChecker(["super_admin", "admin", "receptionist"]))
):
    """
    Update the status of a contact message (e.g., read, replied).
    """
    msg = crud_forms.update_contact_status(db=db, message_id=message_id, status=status_update.status)
    if not msg:
        raise HTTPException(status_code=404, detail="الرسالة غير موجودة")
    return msg

@router.delete("/{message_id}")
def delete_contact(
    message_id: str,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.RoleChecker(["super_admin", "admin"]))
):
    """
    Delete a contact message.
    """
    msg = crud_forms.delete_contact_message(db=db, message_id=message_id)
    if not msg:
        raise HTTPException(status_code=404, detail="الرسالة غير موجودة")
    return {"message": "تم حذف الرسالة بنجاح"}
