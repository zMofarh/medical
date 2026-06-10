import { useState, useEffect, useCallback } from "react";
import { updatePackage, createPackage, CMSPackageCreate, CMSPackageUpdate } from "@/api/packages";
import { packageCategories, type PackageCategory } from "@/mocks/packagesData";
import { useDataContext, MedicalPackage } from "@/context/DataContext";

export type { MedicalPackage };

/** Derive unique ordered categories from a packages list */
function deriveCategories(pkgs: MedicalPackage[]): PackageCategory[] {
  const seen = new Set<string>();
  for (const pkg of pkgs) {
    if (!seen.has(pkg.category)) {
      seen.add(pkg.category);
    }
  }
  // Keep original order from packageCategories for any that exist
  return packageCategories.filter((c) => seen.has(c));
}

// ─── Public hook (for public-facing pages) ────────────────────────────────────
export function usePublicPackages() {
  const { packages } = useDataContext();
  const categories = deriveCategories(packages);
  return { packages, categories };
}

// ─── CMS Admin hook (for CMS admin pages) ────────────────────────────────────
export function useCMSPackages() {
  const {
    packages: globalPackages,
    packagesLoading: loading,
    packagesError: error,
    reloadPackages: reload,
  } = useDataContext();

  const [packages, setPackages] = useState<MedicalPackage[]>(globalPackages);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [hasChanges, setHasChanges] = useState(false);

  // Keep local editor state in sync with global state changes
  useEffect(() => {
    setPackages(globalPackages);
  }, [globalPackages]);

  const save = useCallback(async (data: MedicalPackage[]) => {
    setSaveStatus("saving");
    try {
      for (const p of data) {
        const apiData = {
          package_id: p.package_id || p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          original_price: p.originalPrice,
          badge: p.badge,
          icon: p.icon,
          features: p.features,
          accent_color: p.accentColor,
          description: p.description,
          duration: p.duration,
          target_audience: p.targetAudience,
          preparation: p.preparation,
          includes: p.includes,
          faqs: p.faqs,
        };
        
        // Update existing using its internal 'id' which matches backend UUID
        if (p.id && !p.id.includes("-") && p.id.length > 20) {
          await updatePackage(p.id, apiData as CMSPackageUpdate);
        } else {
          await createPackage(apiData as CMSPackageCreate);
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

  const updatePackages = useCallback((data: MedicalPackage[]) => {
    setPackages(data);
    setHasChanges(true);
  }, []);

  const reset = useCallback(async () => {
    await reload();
    setHasChanges(false);
  }, [reload]);

  return {
    packages,
    loading,
    error,
    saveStatus,
    hasChanges,
    updatePackages,
    save,
    reset,
    reload,
  };
}
