from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from uuid import UUID
from datetime import datetime

class ContactMessageCreate(BaseModel):
    full_name: str = Field(..., min_length=3, description="الاسم الكامل")
    phone: str = Field(..., min_length=9, max_length=20, description="رقم الجوال")
    email: Optional[EmailStr] = Field(None, description="البريد الإلكتروني")
    subject: str = Field(..., min_length=3, description="موضوع الرسالة")
    message: str = Field(..., min_length=10, description="نص الرسالة")

class BookingCreate(BaseModel):
    full_name: str = Field(..., min_length=3, description="الاسم الكامل")
    phone: str = Field(..., min_length=9, max_length=20, description="رقم الجوال")
    email: Optional[EmailStr] = Field(None, description="البريد الإلكتروني")
    age: Optional[int] = Field(None, ge=1, le=120, description="العمر")
    gender: Optional[str] = Field(None, description="الجنس")
    complaint: Optional[str] = Field(None, description="الشكوى أو ملاحظات")
    service_id: Optional[str] = Field(None, description="معرف الخدمة المطلوبة")
    doctor_id: Optional[str] = Field(None, description="معرف الطبيب المطلوب")
    package_id: Optional[str] = Field(None, description="معرف الباقة المطلوبة")
    visit_type: str = Field(..., description="نوع الزيارة (first, followup, consultation)")
    selected_date: str = Field(..., description="تاريخ الموعد المفضل")
    selected_time: str = Field(..., description="وقت الموعد المفضل")

class BookingResponse(BookingCreate):
    id: UUID
    booking_ref: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class ContactMessageResponse(ContactMessageCreate):
    id: UUID
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class StatusUpdate(BaseModel):
    status: str = Field(..., description="الحالة الجديدة (مثل: confirmed, cancelled, read, replied)")
