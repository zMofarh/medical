import { API_BASE_URL } from './config';
const BLOG_API_URL = `${API_BASE_URL}/blog`;

// --- Backend Interfaces ---
export interface BackendCategory {
  id: string;
  category_id: string;
  label: string;
}

export interface BackendPost {
  id: string;
  post_id: string;
  title: string;
  excerpt?: string;
  content?: string;
  category?: string;
  category_id?: string;
  author?: string;
  author_role?: string;
  author_image?: string;
  date?: string;
  read_time?: string;
  image?: string;
  tags: string[];
  featured?: boolean;
  status: string;
  views: number;
  created_at: string;
  updated_at: string;
}

// --- Frontend Interfaces ---
export interface BlogCategory {
  id: string;
  label: string;
  icon?: string;
  count?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string; 
  categoryId: string;
  author: string;
  authorRole: string;
  authorImage: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
  featured: boolean;
  views: number;
  status: "published" | "draft";
}

// --- Adapters ---

export const adaptCategory = (cat: BackendCategory): BlogCategory => ({
  id: cat.category_id,
  label: cat.label,
  icon: (cat as any).icon || "ri-article-line",
  count: (cat as any).count || 0,
});

export const adaptPost = (post: BackendPost, categories: BlogCategory[]): BlogPost => {
  const cat = categories.find(c => c.id === post.category_id);
  return {
    id: post.post_id,
    title: post.title,
    excerpt: post.excerpt || "",
    content: post.content || "",
    category: cat ? cat.label : (post.category || ""),
    categoryId: post.category_id || "",
    author: post.author || "",
    authorRole: post.author_role || "",
    authorImage: post.author_image || "",
    date: post.date || "",
    readTime: post.read_time || "5 دقائق",
    image: post.image || "",
    tags: post.tags,
    featured: post.featured || false,
    views: post.views,
    status: (post.status as "published" | "draft") || "draft",
  };
};

export const toBackendPost = (post: Partial<BlogPost>) => ({
  post_id: post.id,
  title: post.title,
  excerpt: post.excerpt,
  content: post.content,
  category: post.category,
  category_id: post.categoryId,
  author: post.author,
  author_role: post.authorRole,
  author_image: post.authorImage,
  date: post.date,
  read_time: post.readTime ? post.readTime.toString() : "5 دقائق",
  image: post.image,
  tags: post.tags || [],
  featured: post.featured || false,
  status: post.status || "draft",
});


// --- API Calls ---

export async function getCategories(): Promise<BlogCategory[]> {
  const response = await fetch(`${BLOG_API_URL}/categories`);
  if (!response.ok) throw new Error("Failed to fetch categories");
  const data: BackendCategory[] = await response.json();
  return data.map(adaptCategory);
}

export async function createCategory(cat: BlogCategory, token: string): Promise<BlogCategory> {
  const response = await fetch(`${BLOG_API_URL}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify({ category_id: cat.id, label: cat.label }),
  });
  if (!response.ok) throw new Error("Failed to create category");
  const data: BackendCategory = await response.json();
  return adaptCategory(data);
}

export async function deleteCategory(categoryId: string, token: string): Promise<void> {
  const res = await fetch(`${BLOG_API_URL}/categories/${categoryId}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.detail || "Failed to delete category");
  }
}

export async function getPosts(status?: string, categoryId?: string, search?: string): Promise<BackendPost[]> {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (categoryId && categoryId !== "all") params.append("category", categoryId);
  if (search) params.append("search", search);

  const res = await fetch(`${BLOG_API_URL}/posts?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function getPost(postId: string): Promise<BackendPost> {
  const res = await fetch(`${BLOG_API_URL}/posts/${postId}`);
  if (!res.ok) throw new Error("Failed to fetch post");
  return res.json();
}

export async function createPost(post: Partial<BlogPost>, token: string): Promise<BackendPost> {
  const response = await fetch(`${BLOG_API_URL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify(toBackendPost(post)),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || "Failed to create post");
  }
  return response.json();
}

export async function updatePost(postId: string, post: Partial<BlogPost>, token: string): Promise<BackendPost> {
  const res = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify(toBackendPost(post)),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.detail || "Failed to update post");
  }
  return res.json();
}

export async function deletePost(postId: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.detail || "Failed to delete post");
  }
}
