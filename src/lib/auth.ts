/**
 * auth.ts — 메모리 기반 인증 상태 관리
 *
 * Access Token in Memory + Refresh Token in HttpOnly Cookie 전략
 *
 * - Access Token : JS 모듈 변수(_token)에 보관 → XSS로 탈취 불가
 * - Refresh Token: 서버가 HttpOnly 쿠키로 설정 → JS에서 접근 불가, 브라우저가 자동 전송
 * - 새로고침 시  : 메모리 초기화 → api.ts의 request()가 401 수신 →
 *                  /auth/refresh 자동 호출 → 새 Access Token 복구
 */

export type Role = "admin" | "guest";

/** 메모리에 저장되는 Access Token */
let _token: string | null = null;

/** 메모리에 저장되는 사용자 역할 */
let _role: Role | null = null;

/** 현재 Access Token 반환 */
export function getAccessToken(): string | null {
  return _token;
}

/**
 * Access Token 직접 설정
 * api.ts에서 /auth/refresh 성공 후 새 토큰을 저장할 때 사용
 */
export function setAccessToken(token: string): void {
  _token = token;
}

/** @deprecated getAccessToken() 사용 권장 (하위 호환 유지) */
export function getSessionToken(): string | null {
  return _token;
}

/** 현재 역할 반환 */
export function getRole(): Role | null {
  return _role;
}

/** 로그인 상태 여부 */
export function getIsLoggedIn(): boolean {
  return _token !== null;
}

/** admin 여부 */
export function getIsAdmin(): boolean {
  return _role === "admin";
}

/**
 * 로그인 성공 시 호출
 * Access Token과 Role을 메모리에 저장합니다.
 * Refresh Token은 서버가 HttpOnly 쿠키로 이미 설정했으므로 별도 처리 불필요.
 */
export function login(role: Role, token: string): void {
  _token = token;
  _role = role;
}

/**
 * 로그아웃 시 호출
 * 메모리를 초기화합니다.
 * Refresh Token 쿠키 제거는 api.ts의 logout() → POST /auth/logout 에서 처리합니다.
 */
export function logout(): void {
  _token = null;
  _role = null;
}
