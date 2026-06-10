import { useState, useEffect, useCallback } from "react";
import { BlogPost, BlogCategory, getPosts, getCategories, createPost, updatePost, deletePost, createCategory, deleteCategory } from "@/api/blog";
import { useDataContext } from "@/context/DataContext";

// ─── Public hook (read-only, reactive) ───────────────────────────────────────
export function usePublicBlog() {
  const { posts, blogCategories: categories, blogLoading: loading } = useDataContext();
  
  // Ensure "all" category exists in public pages
  const publicCategories = [{ id: "all", label: "الكل" }, ...categories];

  return { posts, allPosts: posts, categories: publicCategories, loading };
}

// ─── Admin CMS hook (read + write) ───────────────────────────────────────────
export function useCMSBlog() {
  const {
    allPosts: globalPosts,
    blogCategories: globalCategories,
    blogLoading: loading,
    blogError: error,
    reloadBlog: reload,
  } = useDataContext();

  const [posts, setPosts] = useState<BlogPost[]>(globalPosts);
  const [categories, setCategories] = useState<BlogCategory[]>(globalCategories);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [hasChanges, setHasChanges] = useState(false);

  // Sync with global state
  useEffect(() => {
    setPosts(globalPosts);
  }, [globalPosts]);

  useEffect(() => {
    // Add "الكل" to admin page if not already there, matching the original implementation
    const adminCats = [{ id: "all", label: "الكل" }, ...globalCategories];
    setCategories(adminCats);
  }, [globalCategories]);

  const saveCategories = useCallback(async (currentCategories: BlogCategory[]) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No token");

      const backendCats = await getCategories();
      const backendCatIds = backendCats.map(c => c.id);
      const currentCats = currentCategories.filter(c => c.id !== "all");
      const currentCatIds = currentCats.map(c => c.id);

      for (const bId of backendCatIds) {
         if (!currentCatIds.includes(bId)) {
             await deleteCategory(bId, token);
         }
      }

      for (const c of currentCats) {
         if (!backendCatIds.includes(c.id)) {
             await createCategory(c, token);
         }
      }
    } catch (err) {
      console.error("Failed to sync categories", err);
    }
  }, []);

  const save = useCallback(async (currentPosts: BlogPost[]) => {
    setSaveStatus("saving");
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No token");

      // Save categories first
      await saveCategories(categories);

      // For posts
      const backendPosts = await getPosts("all");
      const backendPostIds = backendPosts.map(p => p.post_id);
      const currentPostIds = currentPosts.map(p => p.id);

      // Deletes
      for (const bId of backendPostIds) {
        if (!currentPostIds.includes(bId)) {
          await deletePost(bId, token);
        }
      }
      
      // Updates & Creates
      for (const p of currentPosts) {
        if (backendPostIds.includes(p.id)) {
          await updatePost(p.id, p, token);
        } else {
          await createPost(p, token);
        }
      }

      await reload();
      setSaveStatus("saved");
      setHasChanges(false);
      setTimeout(() => setSaveStatus("idle"), 2500);
      return { success: true };
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
      return { success: false };
    }
  }, [categories, saveCategories, reload]);

  const updatePosts = useCallback((data: BlogPost[]) => {
    setPosts(data);
    setHasChanges(true);
  }, []);

  const updateCategories = useCallback((data: BlogCategory[]) => {
    setCategories(data);
    setHasChanges(true);
  }, []);

  const reset = useCallback(async () => {
    await reload();
    setHasChanges(false);
  }, [reload]);

  return {
    posts,
    categories,
    saveStatus,
    hasChanges,
    updatePosts,
    updateCategories,
    save,
    reset,
    reload,
    loading,
    error,
  };
}
export type { BlogPost, BlogCategory };
