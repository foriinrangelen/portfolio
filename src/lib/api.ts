/**
 * api.ts — 백엔드 API 클라이언트
 *
 * Access Token (메모리) + Refresh Token (HttpOnly 쿠키) 전략
 *
 * 요청 흐름:
 *  1. request() 호출 → Authorization: Bearer <accessToken> 헤더 첨부
 *  2. 서버 응답 401 → refreshAccessToken() 자동 호출
 *     - POST /auth/refresh (쿠키 자동 전송, credentials: "include")
 *     - 성공 → 새 Access Token을 메모리에 저장 → 원래 요청 1회 재시도
 *     - 실패(refresh 토큰 만료) → 로그아웃 처리
 *  3. 재시도 후 또 401 → 로그아웃 (무한 루프 방지)
 */
import type { Portfolio } from "#/data/portfolios";
import type { LoginRequestDto, LoginResponseDto } from "#/types/auth.dto";
import { getAccessToken, setAccessToken, logout } from "./auth";

/** API 서버 베이스 URL */
const BASE =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  "https://portfolio-server.kyyyy8629.workers.dev";

/**
 * API 활성화 여부
 * BASE URL이 설정된 경우 API 모드, 아니면 localStorage 폴백 모드
 */
export function isApiEnabled(): boolean {
  return !!BASE;
}

/**
 * Access Token 재발급
 *
 * HttpOnly 쿠키의 Refresh Token을 서버로 전송(credentials: "include")해
 * 새 Access Token을 발급받아 메모리에 저장합니다.
 *
 * @returns 새 accessToken 문자열, 실패 시 null
 */
export async function refreshAccessToken(): Promise<{
  accessToken: string;
  role: import("#/types/auth.dto").Role;
} | null> {
  try {
    const res = await fetch(`${BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include", // HttpOnly 쿠키를 자동으로 전송
    });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      accessToken: string;
      role: import("#/types/auth.dto").Role;
    };
    setAccessToken(data.accessToken);
    return data;
  } catch {
    return null;
  }
}

/**
 * 공통 HTTP 요청 함수
 *
 * - Access Token을 Authorization: Bearer 헤더에 첨부
 * - 401 응답 시 Refresh Token으로 재발급 후 1회 재시도
 * - 재시도 후에도 401이면 로그아웃 처리
 *
 * @param path     - API 경로 (예: "/portfolios")
 * @param options  - fetch RequestInit 옵션
 * @param _isRetry - 재시도 여부 플래그 (무한 루프 방지용, 내부 전용)
 */
async function request<T>(
  path: string,
  options?: RequestInit,
  _isRetry = false,
): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...headers,
      ...((options?.headers as Record<string, string>) ?? {}),
    },
  });

  // Access Token 만료 → refresh 시도 후 재요청 (1회만)
  if (res.status === 401 && !_isRetry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return request<T>(path, options, true);
    }
    // Refresh Token도 만료 → 강제 로그아웃
    logout();
    throw new Error("Session expired. Please log in again.");
  }

  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

/* ── Portfolio API ──────────────────────────────────────── */

/**
 * GET /portfolio
 * 전체 포트폴리오 목록 조회 (공개)
 */
export async function fetchPortfolios(): Promise<Portfolio[]> {
  if (!isApiEnabled()) throw new Error("API not configured");
  return request<Portfolio[]>("/portfolio");
}

/**
 * GET /portfolio/:id
 * 포트폴리오 상세 조회 (공개)
 */
export async function fetchPortfolio(id: string): Promise<Portfolio> {
  if (!isApiEnabled()) throw new Error("API not configured");
  return request<Portfolio>(`/portfolio/${id}`);
}

/**
 * POST /portfolio
 * 포트폴리오 생성 (admin 전용)
 */
export async function createPortfolio(
  portfolio: Portfolio,
): Promise<Portfolio> {
  if (!isApiEnabled()) throw new Error("API not configured");
  return request<Portfolio>("/portfolio", {
    method: "POST",
    body: JSON.stringify(portfolio),
  });
}

/**
 * PUT /portfolio/:id
 * 포트폴리오 수정 (admin 전용)
 */
export async function patchPortfolio(portfolio: Portfolio): Promise<Portfolio> {
  if (!isApiEnabled()) throw new Error("API not configured");
  return request<Portfolio>(`/portfolio/${portfolio.id}`, {
    method: "PUT",
    body: JSON.stringify(portfolio),
  });
}

/**
 * DELETE /portfolio/:id
 * 포트폴리오 삭제 (admin 전용)
 */
export async function removePortfolio(id: string): Promise<void> {
  if (!isApiEnabled()) throw new Error("API not configured");
  await request(`/portfolio/${id}`, { method: "DELETE" });
}

/* ── Auth API ───────────────────────────────────────────── */

/**
 * POST /auth/login
 * 로그인 — Access Token(바디) + Refresh Token(HttpOnly 쿠키) 수신
 *
 * 반환된 accessToken과 role을 auth.ts의 login()으로 메모리에 저장하세요.
 *
 * ※ request() 대신 fetch 직접 사용: 로그인은 인증 불필요 엔드포인트이므로
 *   401 → refreshAccessToken 재시도 로직이 개입하면 안 됩니다.
 */
export async function login(
  credentials: LoginRequestDto,
): Promise<LoginResponseDto> {
  if (!isApiEnabled()) throw new Error("API not configured");
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json() as Promise<LoginResponseDto>;
}

/**
 * POST /auth/logout
 * 로그아웃 — 서버가 Refresh Token 쿠키를 만료시킵니다.
 * 클라이언트 메모리 초기화는 auth.ts의 logout()으로 별도 처리해야 합니다.
 */
export async function logoutApi(): Promise<void> {
  try {
    await request("/auth/logout", { method: "POST" });
  } catch {
    // 서버 오류가 나도 클라이언트 로그아웃은 진행
  }
}
