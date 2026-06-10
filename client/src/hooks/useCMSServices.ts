import { useState, useEffect, useCallback } from "react";
import { updateService, createService, CMSServiceCreate, CMSServiceUpdate } from "@/api/services";
import { useDataContext, ServiceDetail } from "@/context/DataContext";

export type { ServiceDetail };

// ─── Public hook (for public-facing pages) ────────────────────────────────────
export function usePublicServices() {
  const { services } = useDataContext();
  return { services };
}

// ─── CMS Admin hook (for CMS admin pages) ────────────────────────────────────
export function useCMSServices() {
  const {
    services: globalServices,
    servicesLoading: loading,
    servicesError: error,
    reloadServices: reload,
  } = useDataContext();

  const [services, setServices] = useState<ServiceDetail[]>(globalServices);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [hasChanges, setHasChanges] = useState(false);

  // Keep local editor state in sync with global state changes
  useEffect(() => {
    setServices(globalServices);
  }, [globalServices]);

  const save = useCallback(async (data: ServiceDetail[]) => {
    setSaveStatus("saving");
    try {
      for (const s of data) {
        const apiData = {
          service_id: s.service_id || s.id,
          name: s.name,
          tagline: s.tagline,
          description: s.description,
          long_description: s.longDescription,
          icon: s.icon,
          accent_color: s.accentColor,
          image: s.image,
          hero_image: s.heroImage,
          category: s.category,
          stats: s.stats,
          procedures: s.procedures,
          prices: s.prices,
          doctors: s.doctors,
          faqs: s.faqs,
          related_services: s.relatedServices,
        };
        
        // Update existing using its internal 'id' which matches backend UUID
        if (s.id && !s.id.startsWith("srv-") && s.id.length > 20) {
          await updateService(s.id, apiData as CMSServiceUpdate);
        } else {
          await createService(apiData as CMSServiceCreate);
        }
      }
      
      await reload();
      setSaveStatus("saved");
      setHasChanges(false);
      setTimeout(() => setSaveStatus("idle"), 2500);
      return { success: true };
    } catch (err) {
      setSaveStatus("error");
      return { success: false, error: err };
    }
  }, [reload]);

  const updateServices = useCallback((data: ServiceDetail[]) => {
    setServices(data);
    setHasChanges(true);
  }, []);

  const reset = useCallback(async () => {
    await reload();
    setHasChanges(false);
  }, [reload]);

  return {
    services,
    loading,
    error,
    saveStatus,
    hasChanges,
    updateServices,
    save,
    reset,
    reload,
  };
}
