import { useState, useEffect, useCallback } from "react";
import { updateDoctor, createDoctor, CMSDoctorCreate, CMSDoctorUpdate } from "@/api/doctors";
import { useDataContext, Doctor } from "@/context/DataContext";

export type { Doctor };

// ─── Public hook (for public-facing pages) ────────────────────────────────────
export function usePublicDoctors() {
  const { doctors } = useDataContext();
  return { doctors };
}

// ─── CMS Admin hook (for CMS admin pages) ────────────────────────────────────
export function useCMSDoctors() {
  const {
    doctors: globalDoctors,
    doctorsLoading: loading,
    doctorsError: error,
    reloadDoctors: reload,
  } = useDataContext();

  const [doctors, setDoctors] = useState<Doctor[]>(globalDoctors);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [hasChanges, setHasChanges] = useState(false);

  // Keep local editor state in sync with global state changes (e.g. initial load or post-save reload)
  useEffect(() => {
    setDoctors(globalDoctors);
  }, [globalDoctors]);

  const save = useCallback(async (data: Doctor[]) => {
    setSaveStatus("saving");
    try {
      for (const d of data) {
        const apiData = {
          doctor_id: d.doctor_id || d.id,
          name: d.name,
          specialty: d.specialty,
          experience: d.experience,
          image: d.image,
          rating: d.rating,
          reviews_count: d.reviewsCount,
          title: d.title,
          education: d.education,
          languages: d.languages,
          available_days: d.availableDays,
          bio: d.bio,
          specializations: d.specializations,
          achievements: d.achievements,
          consultation_fee: d.consultationFee,
          reviews: d.reviews,
        };
        // Update existing using its internal 'id' which matches backend UUID
        if (d.id && !d.id.startsWith("dr-")) {
          await updateDoctor(d.id, apiData as CMSDoctorUpdate);
        } else {
          // fallback if somehow a new doctor was created in the CMS editor
          await createDoctor(apiData as CMSDoctorCreate);
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

  const updateDoctors = useCallback((data: Doctor[]) => {
    setDoctors(data);
    setHasChanges(true);
  }, []);

  const reset = useCallback(async () => {
    await reload();
    setHasChanges(false);
  }, [reload]);

  return {
    doctors,
    loading,
    error,
    saveStatus,
    hasChanges,
    updateDoctors,
    save,
    reset,
    reload,
  };
}
