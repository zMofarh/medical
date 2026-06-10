import { useState, useEffect, useCallback } from "react";
import {
  offersHeroData,
  seasonalOffersData,
  flashDealsData,
  howToRedeemSteps,
  offersNotifyData,
  type OffersHeroCMS,
  type SeasonalOfferCMS,
  type FlashDealCMS,
  type HowToRedeemStep,
  type OffersNotifyCMS,
} from "@/mocks/offersData";
import { useDataContext } from "@/context/DataContext";

// ─── CMS Admin hook (for CMS admin pages) ────────────────────────────────────
export function useCMSOffers() {
  const {
    offersHero: globalHero,
    offersSeasonal: globalSeasonal,
    offersFlash: globalFlash,
    offersRedeem: globalRedeem,
    offersNotify: globalNotify,
    saveOffers,
    resetOffers,
  } = useDataContext();

  const [hero, setHero]         = useState<OffersHeroCMS>(globalHero);
  const [seasonal, setSeasonal] = useState<SeasonalOfferCMS[]>(globalSeasonal);
  const [flash, setFlash]       = useState<FlashDealCMS[]>(globalFlash);
  const [redeem, setRedeem]     = useState<HowToRedeemStep[]>(globalRedeem);
  const [notify, setNotify]     = useState<OffersNotifyCMS>(globalNotify);
  
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
    hero: OffersHeroCMS;
    seasonal: SeasonalOfferCMS[];
    flash: FlashDealCMS[];
    redeem: HowToRedeemStep[];
    notify: OffersNotifyCMS;
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

  const updateHero = useCallback((d: OffersHeroCMS) => { setHero(d); setHasChanges(true); }, []);
  const updateSeasonal = useCallback((d: SeasonalOfferCMS[]) => { setSeasonal(d); setHasChanges(true); }, []);
  const updateFlash = useCallback((d: FlashDealCMS[]) => { setFlash(d); setHasChanges(true); }, []);
  const updateRedeem = useCallback((d: HowToRedeemStep[]) => { setRedeem(d); setHasChanges(true); }, []);
  const updateNotify = useCallback((d: OffersNotifyCMS) => { setNotify(d); setHasChanges(true); }, []);

  const reset = useCallback(() => {
    resetOffers();
    setHasChanges(false);
  }, [resetOffers]);

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
export type { OffersHeroCMS, SeasonalOfferCMS, FlashDealCMS, HowToRedeemStep, OffersNotifyCMS };
