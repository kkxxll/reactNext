/**
 * 认证服务层
 *
 * 提供登录、登出、获取当前用户等方法。
 * token 存储在 localStorage 中，由 request.ts 拦截器自动注入。
 */
import http from '../utils/request';
import type { ApiResponse } from '../utils/request';

export interface LoginParams {
  username: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  role: string;
}

export interface LoginResult {
  token: string;
  user: AuthUser;
}

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

/** 登录 */
export async function login(params: LoginParams): Promise<LoginResult> {
  const res = await http.post<ApiResponse<LoginResult>>('/api/auth/login', params);
  const { token, user } = res.data.data;
  // 持久化 token 和用户信息
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return { token, user };
}

/** 登出 */
export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.location.href = '/login';
}

/** 获取本地存储的用户信息 */
export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** 获取 token */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/** 是否已登录 */
export function isAuthenticated(): boolean {
  return !!getToken();
}
