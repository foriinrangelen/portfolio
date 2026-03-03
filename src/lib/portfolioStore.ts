import type { Portfolio } from "#/data/portfolios";
import {
  isApiEnabled,
  fetchPortfolios as apiFetch,
  createPortfolio as apiCreate,
  patchPortfolio as apiPatch,
  removePortfolio as apiRemove,
} from "./api";

/* ── Query Keys ─────────────────────────────────────────── */

export const portfolioKeys = {
  all: ["portfolios"] as const,
  detail: (id: string) => ["portfolios", id] as const,
};

/* ── localStorage layer ─────────────────────────────────── */

const KEY = "custom_portfolios";

function getLocalPortfolios(): Portfolio[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Portfolio[]) : [];
  } catch {
    return [];
  }
}

function setLocalPortfolios(list: Portfolio[]): void {
  localStorage.setItem(KEY, JSON.stringify(list));
}

/* ── Query Functions ─────────────────────────────────────── */

export async function fetchAllPortfolios(): Promise<Portfolio[]> {
  if (isApiEnabled()) return apiFetch();
  return getLocalPortfolios();
}

export async function fetchPortfolioById(
  id: string,
): Promise<Portfolio | undefined> {
  const list = await fetchAllPortfolios();
  return list.find((p) => p.id === id);
}

/* ── Mutation Functions ──────────────────────────────────── */

export async function savePortfolio(portfolio: Portfolio): Promise<void> {
  if (isApiEnabled()) {
    await apiCreate(portfolio);
    return;
  }
  const list = getLocalPortfolios();
  list.push(portfolio);
  setLocalPortfolios(list);
}

export async function updatePortfolio(portfolio: Portfolio): Promise<void> {
  if (isApiEnabled()) {
    await apiPatch(portfolio);
    return;
  }
  const list = getLocalPortfolios();
  const idx = list.findIndex((p) => p.id === portfolio.id);
  if (idx !== -1) {
    list[idx] = portfolio;
    setLocalPortfolios(list);
  }
}

export async function deletePortfolio(id: string): Promise<void> {
  if (isApiEnabled()) {
    await apiRemove(id);
    return;
  }
  const list = getLocalPortfolios();
  const filtered = list.filter((p) => p.id !== id);
  setLocalPortfolios(filtered);
}

/* ── 유틸리티 ───────────────────────────────────────────── */

export function generateId(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-가-힣]/g, "")
    .slice(0, 40);
  return `${slug}-${Date.now()}`;
}
