import { useState, useEffect, useCallback } from "react";
import {
  contactHero,
  contactMethods,
  contactFormConfig,
  contactMapConfig,
  contactWorkingHours,
  contactSocialLinks,
  contactCtaBanner,
  contactFaqTeaser,
} from "@/mocks/contactData";
import { useDataContext } from "@/context/DataContext";

type ContactHero         = typeof contactHero;
type ContactMethods      = typeof contactMethods;
type ContactFormConfig   = typeof contactFormConfig;
type ContactMapConfig    = typeof contactMapConfig;
type ContactWorkingHours = typeof contactWorkingHours;
type ContactSocialLinks  = typeof contactSocialLinks;
type ContactCtaBanner    = typeof contactCtaBanner;
type ContactFaqTeaser    = typeof contactFaqTeaser;

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
    resetContact,
  } = useDataContext();

  const [hero, setHero]       = useState<ContactHero>(globalHero);
  const [methods, setMethods] = useState<ContactMethods>(globalMethods);
  const [form, setForm]       = useState<ContactFormConfig>(globalForm);
  const [map, setMap]         = useState<ContactMapConfig>(globalMap);
  const [hours, setHours]     = useState<ContactWorkingHours>(globalHours);
  const [social, setSocial]   = useState<ContactSocialLinks>(globalSocial);
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
    hero: ContactHero; methods: ContactMethods; form: ContactFormConfig;
    map: ContactMapConfig; hours: ContactWorkingHours; social: ContactSocialLinks;
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

  const updateHero    = useCallback((d: ContactHero)         => { setHero(d);    mark(); }, []);
  const updateMethods = useCallback((d: ContactMethods)      => { setMethods(d); mark(); }, []);
  const updateForm    = useCallback((d: ContactFormConfig)   => { setForm(d);    mark(); }, []);
  const updateMap     = useCallback((d: ContactMapConfig)    => { setMap(d);     mark(); }, []);
  const updateHours   = useCallback((d: ContactWorkingHours) => { setHours(d);   mark(); }, []);
  const updateSocial  = useCallback((d: ContactSocialLinks)  => { setSocial(d);  mark(); }, []);
  const updateCta     = useCallback((d: ContactCtaBanner)    => { setCta(d);     mark(); }, []);
  const updateFaq     = useCallback((d: ContactFaqTeaser)    => { setFaq(d);     mark(); }, []);

  const reset = useCallback(() => {
    resetContact();
    setHasChanges(false);
  }, [resetContact]);

  return {
    hero, methods, form, map, hours, social, cta, faq,
    saveStatus, hasChanges,
    updateHero, updateMethods, updateForm, updateMap, updateHours, updateSocial, updateCta, updateFaq,
    save, reset,
  };
}
