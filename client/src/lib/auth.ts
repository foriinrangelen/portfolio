import { getCookie, setCookie, removeCookie } from "./cookie";

const TOKEN_KEY = "auth_token";
const ROLE_KEY = "auth_role";
const SESSION_KEY = "session_token";

export type Role = "admin" | "guest";

export function getIsLoggedIn(): boolean {
  return getCookie(TOKEN_KEY) !== null;
}

export function getRole(): Role | null {
  return (getCookie(ROLE_KEY) as Role) ?? null;
}

export function getIsAdmin(): boolean {
  return getRole() === "admin";
}

export function getSessionToken(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function login(role: Role, token: string): void {
  setCookie(TOKEN_KEY, `session_${Date.now()}`);
  setCookie(ROLE_KEY, role);
  localStorage.setItem(SESSION_KEY, token);
}

export function logout(): void {
  removeCookie(TOKEN_KEY);
  removeCookie(ROLE_KEY);
  localStorage.removeItem(SESSION_KEY);
}
