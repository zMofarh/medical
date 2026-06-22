import { useState, useEffect, useCallback } from "react";
import { useDataContext } from "@/context/DataContext";
import { FlashDeal, HowToRedeemStep, OffersHeroData, OffersNotifyData, SeasonalOffer } from "@/types/cms";

export type OffersHeroCMS = OffersHeroData;
export type SeasonalOfferCMS = SeasonalOffer;
export type FlashDealCMS = FlashDeal;
export type OffersNotifyCMS = OffersNotifyData;

// ─── CMS Admin hook (for CMS admin pages) ────────────────────────────────────
export function useCMSOffers() {
  const {
    offersHero: globalHero,
    offersSeasonal: globalSeasonal,
    offersFlash: globalFlash,
    offersRedeem: globalRedeem,
    offersNotify: globalNotify,
    saveOffers,
  } = useDataContext();

  const [hero, setHero]         = useState<OffersHeroData>(globalHero);
  const [seasonal, setSeasonal] = useState<SeasonalOffer[]>(globalSeasonal);
  const [flash, setFlash]       = useState<FlashDeal[]>(globalFlash);
  const [redeem, setRedeem]     = useState<HowToRedeemStep[]>(globalRedeem);
  const [notify, setNotify]     = useState<OffersNotifyData>(globalNotify);
  
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHero(globalHero);
    setSeasonal(globalSeasonal);
    setFlash(globalFlash);
    setRedeem(globalRedeem);
    setNotify(globalNotify);
  }, [globalHero, globalSeasonal, globalFlash, globalRedeem, globalNotify]);

  const save = useCallback(async (data: {
    hero: OffersHeroData;
    seasonal: SeasonalOffer[];
    flash: FlashDeal[];
    redeem: HowToRedeemStep[];
    notify: OffersNotifyData;
  }) => {
    setSaveStatus("saving");
    try {
      await saveOffers(data);
      setSaveStatus("saved");
      setHasChanges(false);
      setTimeout(() => setSaveStatus("idle"), 2500);
      return { success: true };
    } catch (err) {
      setSaveStatus("error");
      return { success: false, error: err };
    }
  }, [saveOffers]);

  const updateHero = useCallback((d: OffersHeroData) => { setHero(d); setHasChanges(true); }, []);
  const updateSeasonal = useCallback((d: SeasonalOffer[]) => { setSeasonal(d); setHasChanges(true); }, []);
  const updateFlash = useCallback((d: FlashDeal[]) => { setFlash(d); setHasChanges(true); }, []);
  const updateRedeem = useCallback((d: HowToRedeemStep[]) => { setRedeem(d); setHasChanges(true); }, []);
  const updateNotify = useCallback((d: OffersNotifyData) => { setNotify(d); setHasChanges(true); }, []);

  const reset = useCallback(() => {
    setHero(globalHero);
    setSeasonal(globalSeasonal);
    setFlash(globalFlash);
    setRedeem(globalRedeem);
    setNotify(globalNotify);
    setHasChanges(false);
  }, [globalHero, globalSeasonal, globalFlash, globalRedeem, globalNotify]);

  return {
    hero, seasonal, flash, redeem, notify,
    saveStatus, hasChanges,
    updateHero, updateSeasonal, updateFlash, updateRedeem, updateNotify,
    save, reset,
  };
}

// ─── Public-facing hook ───────────────────────────────────────────────────────
export function usePublicOffers() {
  const {
    offersHero: hero,
    offersSeasonal: seasonal,
    offersFlash: flash,
    offersRedeem: redeem,
    offersNotify: notify,
  } = useDataContext();

  return {
    hero,
    seasonal: seasonal.filter((s) => s.active),
    flash: flash.filter((f) => f.active),
    redeem,
    notify,
  };
}
export type { HowToRedeemStep };
