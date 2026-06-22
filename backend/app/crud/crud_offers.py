from sqlalchemy.orm import Session
from app.models.offers import CMSOffers, Offer
from app.schemas.offers import CMSOffersUpdate, CMSOffersCreate, OfferCreate, OfferUpdate
from typing import Optional, List

# CMS Offers Page
def get_cms_offers(db: Session) -> Optional[CMSOffers]:
    return db.query(CMSOffers).first()

def create_cms_offers(db: Session, obj_in: CMSOffersCreate) -> CMSOffers:
    db_obj = CMSOffers(**obj_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_cms_offers(db: Session, obj_in: CMSOffersUpdate) -> CMSOffers:
    db_obj = db.query(CMSOffers).first()
    if not db_obj:
        return create_cms_offers(db, CMSOffersCreate(**obj_in.model_dump()))
    
    update_data = obj_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

# Offers
def get_offers(db: Session, type: Optional[str] = None) -> List[Offer]:
    query = db.query(Offer)
    if type:
        query = query.filter(Offer.type == type)
    return query.all()

def get_offer_by_id(db: Session, offer_id: str) -> Optional[Offer]:
    return db.query(Offer).filter(Offer.offer_id == offer_id).first()

def create_offer(db: Session, obj_in: OfferCreate) -> Offer:
    db_obj = Offer(**obj_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_offer(db: Session, offer_id: str, obj_in: OfferUpdate) -> Optional[Offer]:
    db_obj = db.query(Offer).filter(Offer.offer_id == offer_id).first()
    if not db_obj:
        return None
    
    update_data = obj_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
        
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_offer(db: Session, offer_id: str) -> bool:
    db_obj = db.query(Offer).filter(Offer.offer_id == offer_id).first()
    if db_obj:
        db.delete(db_obj)
        db.commit()
        return True
    return False
