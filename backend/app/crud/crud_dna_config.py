from sqlalchemy.orm import Session
from app.models.dna_config import DNAQuestion, DNAResultTemplate, DNAEvaluation
from app.schemas.dna_config import DNAQuestionCreate, DNAQuestionUpdate, DNAResultTemplateCreate, DNAResultTemplateUpdate
from typing import Optional, List

# Questions
def get_dna_questions(db: Session) -> List[DNAQuestion]:
    # Order by order_index if possible, otherwise just return all
    return db.query(DNAQuestion).order_by(DNAQuestion.order_index).all()

def get_dna_question_by_id(db: Session, question_id: str) -> Optional[DNAQuestion]:
    return db.query(DNAQuestion).filter(DNAQuestion.question_id == question_id).first()

def create_dna_question(db: Session, obj_in: DNAQuestionCreate) -> DNAQuestion:
    db_obj = DNAQuestion(**obj_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_dna_question(db: Session, question_id: str, obj_in: DNAQuestionUpdate) -> Optional[DNAQuestion]:
    db_obj = db.query(DNAQuestion).filter(DNAQuestion.question_id == question_id).first()
    if not db_obj:
        return None
    
    update_data = obj_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
        
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_dna_question(db: Session, question_id: str) -> bool:
    db_obj = db.query(DNAQuestion).filter(DNAQuestion.question_id == question_id).first()
    if db_obj:
        db.delete(db_obj)
        db.commit()
        return True
    return False

# Templates
def get_dna_templates(db: Session) -> List[DNAResultTemplate]:
    return db.query(DNAResultTemplate).all()

def get_dna_template_by_id(db: Session, template_id: str) -> Optional[DNAResultTemplate]:
    return db.query(DNAResultTemplate).filter(DNAResultTemplate.template_id == template_id).first()

def create_dna_template(db: Session, obj_in: DNAResultTemplateCreate) -> DNAResultTemplate:
    db_obj = DNAResultTemplate(**obj_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_dna_template(db: Session, template_id: str, obj_in: DNAResultTemplateUpdate) -> Optional[DNAResultTemplate]:
    db_obj = db.query(DNAResultTemplate).filter(DNAResultTemplate.template_id == template_id).first()
    if not db_obj:
        return None
    
    update_data = obj_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
        
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_dna_template(db: Session, template_id: str) -> bool:
    db_obj = db.query(DNAResultTemplate).filter(DNAResultTemplate.template_id == template_id).first()
    if db_obj:
        db.delete(db_obj)
        db.commit()
        return True
    return False

# Evaluations
def get_dna_evaluations(db: Session, skip: int = 0, limit: int = 100) -> List[DNAEvaluation]:
    return db.query(DNAEvaluation).order_by(DNAEvaluation.created_at.desc()).offset(skip).limit(limit).all()

def get_dna_evaluation_by_id(db: Session, eval_id: str) -> Optional[DNAEvaluation]:
    try:
        from uuid import UUID
        val = UUID(eval_id)
        return db.query(DNAEvaluation).filter(DNAEvaluation.id == val).first()
    except ValueError:
        return None

def create_dna_evaluation(db: Session, *, patient_name: Optional[str], patient_age: Optional[int], patient_email: Optional[str], patient_phone: Optional[str], overall_score: int, risk_level: str, answers: dict, report_content: dict) -> DNAEvaluation:
    db_obj = DNAEvaluation(
        patient_name=patient_name,
        patient_age=patient_age,
        patient_email=patient_email,
        patient_phone=patient_phone,
        overall_score=overall_score,
        risk_level=risk_level,
        answers=answers,
        report_content=report_content,
        status="new",
        notes=""
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_dna_evaluation(db: Session, eval_id: str, status: Optional[str] = None, notes: Optional[str] = None) -> Optional[DNAEvaluation]:
    db_obj = get_dna_evaluation_by_id(db, eval_id)
    if not db_obj:
        return None
    if status is not None:
        db_obj.status = status
    if notes is not None:
        db_obj.notes = notes
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

