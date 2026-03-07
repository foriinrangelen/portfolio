/**
 * auth.ts — 메모리 기반 인증 상태 관리
 *
 * Access Token과 Role을 JavaScript 모듈 변수에 보관합니다.
 * - XSS 공격으로부터 안전 (localStorage/쿠키 미사용)
 * - 페이지 새로고침 시 로그아웃 상태로 초기화 (의도된 동작)
 */

export type Role = "admin" | "guest";

let _token: string | null = null;
let _role: Role | null = null;

export function getSessionToken(): string | null {
  return _token;
}

export function getRole(): Role | null {
  return _role;
}

export function getIsLoggedIn(): boolean {
  return _token !== null;
}

export function getIsAdmin(): boolean {
  return _role === "admin";
}

export function login(role: Role, token: string): void {
  _token = token;
  _role = role;
}

export function logout(): void {
  _token = null;
  _role = null;
}
