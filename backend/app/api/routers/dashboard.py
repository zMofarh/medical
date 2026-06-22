from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import Any, Dict

from app.api import deps
from app.models.user import User
from app.models.booking import Booking
from app.models.contact import ContactMessage
from app.models.cms import CMSDoctor

router = APIRouter()

@router.get("/dashboard-stats")
def get_dashboard_stats(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Get statistics for the admin dashboard.
    """
    today_str = datetime.now().strftime("%Y-%m-%d")
    seven_days_ago_str = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")

    # Real DB Counts
    today_bookings = db.query(Booking).filter(Booking.selected_date == today_str).count()
    weekly_bookings = db.query(Booking).filter(Booking.selected_date >= seven_days_ago_str).count()
    pending_bookings = db.query(Booking).filter(Booking.status == "pending").count()
    unread_messages = db.query(ContactMessage).filter(ContactMessage.status == "new").count()

    # Get today's bookings for the schedule
    today_schedule_records = db.query(Booking).filter(
        Booking.selected_date == today_str
    ).order_by(Booking.selected_time).limit(5).all()

    today_schedule = [
        {
            "id": str(b.id),
            "patientName": b.full_name,
            "time": b.selected_time,
            "doctor": b.doctor_id or "غير محدد",
            "type": b.visit_type,
            "status": b.status
        }
        for b in today_schedule_records
    ]

    # Get doctors and map to "Top Doctors" format
    all_doctors = db.query(CMSDoctor).limit(4).all()
    top_doctors = [
        {
            "id": str(d.id),
            "name": d.name,
            "specialty": d.specialty,
            "rating": 4.8, # Mock rating
            "patients": 120 # Mock patients count
        }
        for d in all_doctors
    ]
    if not top_doctors:
        # Fallback mock top doctors if none in DB
        top_doctors = [
            { "id": "1", "name": "د. أحمد عبدالله", "specialty": "طب الأسنان", "rating": 4.9, "patients": 145 },
            { "id": "2", "name": "د. سارة محمد", "specialty": "الجلدية والتجميل", "rating": 4.8, "patients": 112 }
        ]

    return {
        "stats": {
            "todayBookings": {
                "value": today_bookings,
                "trend": "+12%",
                "isPositive": True
            },
            "weeklyBookings": {
                "value": weekly_bookings,
                "trend": "+5%",
                "isPositive": True
            },
            "pendingBookings": {
                "value": pending_bookings,
                "trend": "-2%",
                "isPositive": False
            },
            "unreadMessages": {
                "value": unread_messages,
                "trend": "0%",
                "isPositive": True
            },
            "totalRevenue": {
                "value": "24,500",
                "trend": "+18%",
                "isPositive": True
            },
            "revenueGrowth": {
                "value": "18.5%",
                "trend": "+2.1%",
                "isPositive": True
            }
        },
        "charts": {
            "monthlyBookings": [
                {"name": "يناير", "الحجوزات": 65},
                {"name": "فبراير", "الحجوزات": 85},
                {"name": "مارس", "الحجوزات": 120},
                {"name": "أبريل", "الحجوزات": 90},
                {"name": "مايو", "الحجوزات": 150},
                {"name": "يونيو", "الحجوزات": 180}
            ],
            "serviceDistribution": [
                {"name": "طب الأسنان", "القيمة": 45},
                {"name": "الجلدية", "القيمة": 30},
                {"name": "الليزر", "القيمة": 15},
                {"name": "العناية", "القيمة": 10}
            ],
            "visitorsWeekly": [
                {"name": "السبت", "الزوار": 120},
                {"name": "الأحد", "الزوار": 200},
                {"name": "الإثنين", "الزوار": 180},
                {"name": "الثلاثاء", "الزوار": 250},
                {"name": "الأربعاء", "الزوار": 210},
                {"name": "الخميس", "الزوار": 300},
                {"name": "الجمعة", "الزوار": 80}
            ]
        },
        "topDoctors": top_doctors,
        "todaySchedule": today_schedule
    }
