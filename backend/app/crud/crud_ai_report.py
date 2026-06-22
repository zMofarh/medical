from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.models.ai_report import AIReport
from app.schemas.ai_report import AIReportCreate

class CRUDAIReport:
    def get(self, db: Session, id: UUID) -> Optional[AIReport]:
        return db.query(AIReport).filter(AIReport.id == id).first()

    def get_multi(self, db: Session, skip: int = 0, limit: int = 100) -> List[AIReport]:
        return db.query(AIReport).order_by(AIReport.created_at.desc()).offset(skip).limit(limit).all()

    def create(self, db: Session, *, obj_in: AIReportCreate) -> AIReport:
        db_obj = AIReport(
            patient_name=obj_in.patient_name,
            patient_age=obj_in.patient_age,
            symptoms=obj_in.symptoms,
            report_content=obj_in.report_content
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id: UUID) -> AIReport:
        obj = db.query(AIReport).get(id)
        db.delete(obj)
        db.commit()
        return obj

ai_report = CRUDAIReport()
