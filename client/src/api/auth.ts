/**
 * Authentication API Service
 * 
 * This file contains the functions to interact with the backend auth endpoints.
 * It uses the native fetch API.
 */

import { API_BASE_URL } from './config';

const AUTH_API_URL = `${API_BASE_URL}/auth`;

export interface LoginCredentials {
  username: string; // The backend uses OAuth2PasswordRequestForm which expects 'username' (we map email to it)
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string | null;
  is_active: boolean;
  last_login: string | null;
}

/**
 * Login a user and receive an access token
 */
export async function login(credentials: LoginCredentials): Promise<TokenResponse> {
  // OAuth2 expects form-urlencoded data
  const formData = new URLSearchParams();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);

  const response = await fetch(`${AUTH_API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || 'فشل تسجيل الدخول. تأكد من صحة البيانات.');
  }

  return response.json();
}

/**
 * Get current logged in user information
 * @param token The bearer access token
 */
export async function getCurrentUser(token: string): Promise<UserResponse> {
  const response = await fetch(`${AUTH_API_URL}/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || 'فشل جلب بيانات المستخدم.');
  }

  return response.json();
}
