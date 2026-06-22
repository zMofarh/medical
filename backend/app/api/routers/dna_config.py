from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.api.deps import get_current_user
from app.schemas.dna_config import (
    DNAQuestion, DNAQuestionUpdate, DNAQuestionCreate, 
    DNAResultTemplate, DNAResultTemplateCreate, DNAResultTemplateUpdate,
    DNAEvaluationResponse, DNAEvaluationUpdate
)
from app.crud import crud_dna_config

router = APIRouter()

# Questions
@router.get("/questions", response_model=List[DNAQuestion])
def read_dna_questions(db: Session = Depends(get_db)):
    """Get all DNA simulator questions (Public)."""
    return crud_dna_config.get_dna_questions(db)

@router.post("/questions", response_model=DNAQuestion)
def create_dna_question(question_in: DNAQuestionCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Create a new DNA question (Admin only)."""
    existing = crud_dna_config.get_dna_question_by_id(db, question_in.question_id)
    if existing:
        raise HTTPException(status_code=400, detail="Question with this ID already exists")
    return crud_dna_config.create_dna_question(db, question_in)

@router.put("/questions/{question_id}", response_model=DNAQuestion)
def update_dna_question(question_id: str, question_in: DNAQuestionUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Update DNA question (Admin only)."""
    question = crud_dna_config.update_dna_question(db, question_id, question_in)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question

@router.delete("/questions/{question_id}")
def delete_dna_question(question_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Delete DNA question (Admin only)."""
    success = crud_dna_config.delete_dna_question(db, question_id)
    if not success:
        raise HTTPException(status_code=404, detail="Question not found")
    return {"message": "Question deleted successfully"}

# Templates
@router.get("/templates", response_model=List[DNAResultTemplate])
def read_dna_templates(db: Session = Depends(get_db)):
    """Get all DNA result templates (Public)."""
    return crud_dna_config.get_dna_templates(db)

@router.post("/templates", response_model=DNAResultTemplate)
def create_dna_template(template_in: DNAResultTemplateCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Create a new DNA template (Admin only)."""
    existing = crud_dna_config.get_dna_template_by_id(db, template_in.template_id)
    if existing:
        raise HTTPException(status_code=400, detail="Template with this ID already exists")
    return crud_dna_config.create_dna_template(db, template_in)

@router.put("/templates/{template_id}", response_model=DNAResultTemplate)
def update_dna_template(template_id: str, template_in: DNAResultTemplateUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Update DNA template (Admin only)."""
    template = crud_dna_config.update_dna_template(db, template_id, template_in)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return template

@router.delete("/templates/{template_id}")
def delete_dna_template(template_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Delete DNA template (Admin only)."""
    success = crud_dna_config.delete_dna_template(db, template_id)
    if not success:
        raise HTTPException(status_code=404, detail="Template not found")
    return {"message": "Template deleted successfully"}

# Evaluations
@router.get("/evaluations", response_model=List[DNAEvaluationResponse])
def read_dna_evaluations(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get all DNA simulator evaluations (Admin only)."""
    return crud_dna_config.get_dna_evaluations(db, skip=skip, limit=limit)

@router.put("/evaluations/{eval_id}", response_model=DNAEvaluationResponse)
def modify_dna_evaluation(
    eval_id: str,
    eval_in: DNAEvaluationUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Update DNA evaluation status or notes (Admin only)."""
    evaluation = crud_dna_config.update_dna_evaluation(db, eval_id, status=eval_in.status, notes=eval_in.notes)
    if not evaluation:
        raise HTTPException(status_code=404, detail="Evaluation not found")
    return evaluation

