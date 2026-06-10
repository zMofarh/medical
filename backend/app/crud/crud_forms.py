import string
import random
from sqlalchemy.orm import Session
from app.models.contact import ContactMessage
from app.models.booking import Booking
from app.schemas.forms import ContactMessageCreate, BookingCreate

def generate_booking_ref(db: Session) -> str:
    """Generate a unique booking reference like MC-XXXXXX"""
    while True:
        chars = string.ascii_uppercase + string.digits
        ref = "MC-" + "".join(random.choices(chars, k=6))
        # Check if it exists
        exists = db.query(Booking).filter(Booking.booking_ref == ref).first()
        if not exists:
            return ref

def create_contact_message(db: Session, message_in: ContactMessageCreate) -> ContactMessage:
    db_obj = ContactMessage(
        full_name=message_in.full_name,
        phone=message_in.phone,
        email=message_in.email,
        subject=message_in.subject,
        message=message_in.message,
        status="new"
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def create_booking(db: Session, booking_in: BookingCreate) -> Booking:
    booking_ref = generate_booking_ref(db)
    db_obj = Booking(
        booking_ref=booking_ref,
        full_name=booking_in.full_name,
        phone=booking_in.phone,
        email=booking_in.email,
        age=booking_in.age,
        gender=booking_in.gender,
        complaint=booking_in.complaint,
        service_id=booking_in.service_id,
        doctor_id=booking_in.doctor_id,
        package_id=booking_in.package_id,
        visit_type=booking_in.visit_type,
        selected_date=booking_in.selected_date,
        selected_time=booking_in.selected_time,
        status="pending"
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

# --- Admin CMS CRUD ---

def get_bookings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Booking).offset(skip).limit(limit).all()

def get_booking_by_id(db: Session, booking_id: str):
    return db.query(Booking).filter(Booking.id == booking_id).first()

def update_booking_status(db: Session, booking_id: str, status: str):
    db_obj = get_booking_by_id(db, booking_id)
    if db_obj:
        db_obj.status = status
        db.commit()
        db.refresh(db_obj)
    return db_obj

def delete_booking(db: Session, booking_id: str):
    db_obj = get_booking_by_id(db, booking_id)
    if db_obj:
        db.delete(db_obj)
        db.commit()
    return db_obj

def get_contact_messages(db: Session, skip: int = 0, limit: int = 100):
    return db.query(ContactMessage).offset(skip).limit(limit).all()

def get_contact_message_by_id(db: Session, message_id: str):
    return db.query(ContactMessage).filter(ContactMessage.id == message_id).first()

def update_contact_status(db: Session, message_id: str, status: str):
    db_obj = get_contact_message_by_id(db, message_id)
    if db_obj:
        db_obj.status = status
        db.commit()
        db.refresh(db_obj)
    return db_obj

def delete_contact_message(db: Session, message_id: str):
    db_obj = get_contact_message_by_id(db, message_id)
    if db_obj:
        db.delete(db_obj)
        db.commit()
    return db_obj

