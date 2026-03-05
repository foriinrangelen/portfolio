import type { Portfolio } from "#/data/portfolios";
import { getSessionToken } from "./auth";

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ??
  "https://portfolio2-api.kyyyy8629.workers.dev";

function isApiEnabled(): boolean {
  return !!BASE;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getSessionToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    ...options,
    headers: { ...headers, ...(options?.headers as Record<string, string> ?? {}) },
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

/* ── Portfolio API ── */

export async function fetchPortfolios(): Promise<Portfolio[]> {
  if (!isApiEnabled()) throw new Error("API not configured");
  return request<Portfolio[]>("/portfolios");
}

export async function fetchPortfolio(id: string): Promise<Portfolio> {
  if (!isApiEnabled()) throw new Error("API not configured");
  return request<Portfolio>(`/portfolios/${id}`);
}

export async function createPortfolio(
  portfolio: Portfolio,
): Promise<Portfolio> {
  if (!isApiEnabled()) throw new Error("API not configured");
  return request<Portfolio>("/portfolios", {
    method: "POST",
    body: JSON.stringify(portfolio),
  });
}

export async function patchPortfolio(portfolio: Portfolio): Promise<Portfolio> {
  if (!isApiEnabled()) throw new Error("API not configured");
  return request<Portfolio>(`/portfolios/${portfolio.id}`, {
    method: "PUT",
    body: JSON.stringify(portfolio),
  });
}

export async function removePortfolio(id: string): Promise<void> {
  if (!isApiEnabled()) throw new Error("API not configured");
  await request(`/portfolios/${id}`, { method: "DELETE" });
}

/* ── Auth API ── */

export async function login(credentials: {
  username: string;
  password: string;
}): Promise<{ token: string; role: string }> {
  if (!isApiEnabled()) throw new Error("API not configured");
  return request<{ token: string; role: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export { isApiEnabled };
