from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.api.deps import get_current_user
from app.schemas.offers import CMSOffers, CMSOffersUpdate, CMSOffersCreate, Offer, OfferCreate, OfferUpdate
from app.crud import crud_offers

router = APIRouter()

@router.get("/page", response_model=CMSOffers)
def read_cms_offers(db: Session = Depends(get_db)):
    """Get offers page configuration (Public)."""
    cms = crud_offers.get_cms_offers(db)
    if not cms:
        cms = CMSOffersCreate()
    return cms

@router.put("/page", response_model=CMSOffers)
def update_cms_offers(cms_in: CMSOffersUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Update offers page configuration (Admin only)."""
    return crud_offers.update_cms_offers(db, cms_in)

@router.get("/", response_model=List[Offer])
def read_offers(type: Optional[str] = None, db: Session = Depends(get_db)):
    """Get all offers (Public). Filter by type if provided."""
    return crud_offers.get_offers(db, type=type)

@router.post("/", response_model=Offer)
def create_offer(offer_in: OfferCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Create a new offer (Admin only)."""
    existing = crud_offers.get_offer_by_id(db, offer_in.offer_id)
    if existing:
        raise HTTPException(status_code=400, detail="Offer with this ID already exists")
    return crud_offers.create_offer(db, offer_in)

@router.get("/{offer_id}", response_model=Offer)
def read_offer(offer_id: str, db: Session = Depends(get_db)):
    """Get specific offer."""
    offer = crud_offers.get_offer_by_id(db, offer_id)
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    return offer

@router.put("/{offer_id}", response_model=Offer)
def update_offer(offer_id: str, offer_in: OfferUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Update specific offer (Admin only)."""
    offer = crud_offers.update_offer(db, offer_id, offer_in)
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    return offer

@router.delete("/{offer_id}")
def delete_offer(offer_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Delete specific offer (Admin only)."""
    success = crud_offers.delete_offer(db, offer_id)
    if not success:
        raise HTTPException(status_code=404, detail="Offer not found")
    return {"message": "Offer deleted successfully"}
