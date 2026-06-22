import { useState, useEffect, useCallback } from "react";
import { useDataContext } from "@/context/DataContext";
import { ContactCtaBanner, ContactFaqTeaser, ContactFormConfig, ContactHeroData, ContactMapConfig, ContactMethod, ContactSocialLink, ContactWorkingHours } from "@/types/cms";

// ─── Public hook (read-only, reactive) ───────────────────────────────────────
export function usePublicContact() {
  const {
    contactHero: hero,
    contactMethods: methods,
    contactFormConfig: form,
    contactMapConfig: map,
    contactWorkingHours: hours,
    contactSocialLinks: social,
    contactCtaBanner: cta,
    contactFaqTeaser: faq,
  } = useDataContext();

  return { hero, methods, form, map, hours, social, cta, faq };
}

// ─── Admin CMS hook (read + write) ───────────────────────────────────────────
export function useCMSContact() {
  const {
    contactHero: globalHero,
    contactMethods: globalMethods,
    contactFormConfig: globalForm,
    contactMapConfig: globalMap,
    contactWorkingHours: globalHours,
    contactSocialLinks: globalSocial,
    contactCtaBanner: globalCta,
    contactFaqTeaser: globalFaq,
    saveContact,
  } = useDataContext();

  const [hero, setHero]       = useState<ContactHeroData>(globalHero);
  const [methods, setMethods] = useState<ContactMethod[]>(globalMethods);
  const [form, setForm]       = useState<ContactFormConfig>(globalForm);
  const [map, setMap]         = useState<ContactMapConfig>(globalMap);
  const [hours, setHours]     = useState<ContactWorkingHours>(globalHours);
  const [social, setSocial]   = useState<ContactSocialLink[]>(globalSocial);
  const [cta, setCta]         = useState<ContactCtaBanner>(globalCta);
  const [faq, setFaq]         = useState<ContactFaqTeaser>(globalFaq);
  
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHero(globalHero);
    setMethods(globalMethods);
    setForm(globalForm);
    setMap(globalMap);
    setHours(globalHours);
    setSocial(globalSocial);
    setCta(globalCta);
    setFaq(globalFaq);
  }, [globalHero, globalMethods, globalForm, globalMap, globalHours, globalSocial, globalCta, globalFaq]);

  const save = useCallback(async (data: {
    hero: ContactHeroData; methods: ContactMethod[]; form: ContactFormConfig;
    map: ContactMapConfig; hours: ContactWorkingHours; social: ContactSocialLink[];
    cta: ContactCtaBanner; faq: ContactFaqTeaser;
  }) => {
    setSaveStatus("saving");
    try {
      await saveContact(data);
      setSaveStatus("saved");
      setHasChanges(false);
      setTimeout(() => setSaveStatus("idle"), 2500);
      return { success: true };
    } catch (err) {
      setSaveStatus("error");
      return { success: false, error: err };
    }
  }, [saveContact]);

  const mark = () => setHasChanges(true);

  const updateHero    = useCallback((d: ContactHeroData)         => { setHero(d);    mark(); }, []);
  const updateMethods = useCallback((d: ContactMethod[])      => { setMethods(d); mark(); }, []);
  const updateForm    = useCallback((d: ContactFormConfig)   => { setForm(d);    mark(); }, []);
  const updateMap     = useCallback((d: ContactMapConfig)    => { setMap(d);     mark(); }, []);
  const updateHours   = useCallback((d: ContactWorkingHours) => { setHours(d);   mark(); }, []);
  const updateSocial  = useCallback((d: ContactSocialLink[])  => { setSocial(d);  mark(); }, []);
  const updateCta     = useCallback((d: ContactCtaBanner)    => { setCta(d);     mark(); }, []);
  const updateFaq     = useCallback((d: ContactFaqTeaser)    => { setFaq(d);     mark(); }, []);

  const reset = useCallback(() => {
    setHero(globalHero);
    setMethods(globalMethods);
    setForm(globalForm);
    setMap(globalMap);
    setHours(globalHours);
    setSocial(globalSocial);
    setCta(globalCta);
    setFaq(globalFaq);
    setHasChanges(false);
  }, [globalHero, globalMethods, globalForm, globalMap, globalHours, globalSocial, globalCta, globalFaq]);

  return {
    hero, methods, form, map, hours, social, cta, faq,
    saveStatus, hasChanges,
    updateHero, updateMethods, updateForm, updateMap, updateHours, updateSocial, updateCta, updateFaq,
    save, reset,
  };
}


