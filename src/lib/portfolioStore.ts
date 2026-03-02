import { portfolios as defaultPortfolios } from "#/data/portfolios";
import type { Portfolio } from "#/data/portfolios";

const KEY = "custom_portfolios";

export function getCustomPortfolios(): Portfolio[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Portfolio[]) : [];
  } catch {
    return [];
  }
}

export function savePortfolio(portfolio: Portfolio): void {
  const list = getCustomPortfolios();
  list.push(portfolio);
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function getAllPortfolios(): Portfolio[] {
  return [...defaultPortfolios, ...getCustomPortfolios()];
}

export function generateId(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-가-힣]/g, "")
    .slice(0, 40);
  return `${slug}-${Date.now()}`;
}

export function extractPreview(body: string): string {
  const stripped = body
    .replace(/```[\s\S]*?```/g, "")
    .replace(/^#+\s.+$/gm, "")
    .replace(/[*_`#>-]/g, "")
    .trim();
  return stripped.length > 120
    ? stripped.slice(0, 120) + "..."
    : stripped;
}
