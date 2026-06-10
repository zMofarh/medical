import { useState, useEffect, useCallback } from "react";
import { clinicInfo, workingHours, socialMedia, emergencyContact } from "@/mocks/clinicSettings";
import { useDataContext } from "@/context/DataContext";

// ─── Types ────────────────────────────────────────────────────────────────────
export type ClinicInfo = typeof clinicInfo;
export type WorkingHours = typeof workingHours;
export type SocialMedia = typeof socialMedia;
export type EmergencyContact = typeof emergencyContact;

export interface ClinicSettings {
  info: ClinicInfo;
  hours: WorkingHours;
  social: SocialMedia;
  emergency: EmergencyContact;
}

// ─── Public hook (read-only, reactive) ───────────────────────────────────────
export function usePublicSettings() {
  const {
    clinicInfo: info,
    clinicHours: hours,
    clinicSocial: social,
    clinicEmergency: emergency,
  } = useDataContext();

  return { info, hours, social, emergency };
}

// ─── Admin CMS hook (read + write) ───────────────────────────────────────────
export function useCMSSettings() {
  const {
    clinicInfo: globalInfo,
    clinicHours: globalHours,
    clinicSocial: globalSocial,
    clinicEmergency: globalEmergency,
    saveSettings,
    resetSettings,
  } = useDataContext();

  const [info, setInfo]           = useState<ClinicInfo>(globalInfo);
  const [hours, setHours]         = useState<WorkingHours>(globalHours);
  const [social, setSocial]       = useState<SocialMedia>(globalSocial);
  const [emergency, setEmergency] = useState<EmergencyContact>(globalEmergency);
  
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setInfo(globalInfo);
    setHours(globalHours);
    setSocial(globalSocial);
    setEmergency(globalEmergency);
  }, [globalInfo, globalHours, globalSocial, globalEmergency]);

  const save = useCallback(async () => {
    setSaveStatus("saving");
    try {
      await saveSettings({ info, hours, social, emergency });
      setSaveStatus("saved");
      setHasChanges(false);
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (err) {
      setSaveStatus("error");
    }
  }, [info, hours, social, emergency, saveSettings]);

  const updateInfo      = useCallback((d: ClinicInfo)       => { setInfo(d);      setHasChanges(true); }, []);
  const updateHours     = useCallback((d: WorkingHours)     => { setHours(d);     setHasChanges(true); }, []);
  const updateSocial    = useCallback((d: SocialMedia)      => { setSocial(d);    setHasChanges(true); }, []);
  const updateEmergency = useCallback((d: EmergencyContact) => { setEmergency(d); setHasChanges(true); }, []);

  const reset = useCallback(() => {
    resetSettings();
    setHasChanges(false);
  }, [resetSettings]);

  return {
    info, hours, social, emergency,
    saveStatus, hasChanges,
    updateInfo, updateHours, updateSocial, updateEmergency,
    save, reset,
  };
}
export type { ClinicSettings as IClinicSettings };
