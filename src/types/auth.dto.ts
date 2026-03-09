/**
 * auth.dto.ts
 * 인증 관련 API 요청/응답 DTO 정의
 *
 * Access Token (메모리) + Refresh Token (HttpOnly 쿠키) 전략에 맞춥니다.
 */

/**
 * POST /auth/login 요청 바디
 */
export type LoginRequestDto = {
  /** 사용자 이름 */
  username: string;
  /** 비밀번호 */
  password: string;
};

/**
 * POST /auth/login 응답 바디
 *
 * - accessToken : 메모리에 저장. Authorization: Bearer 헤더로 사용 (15분 유효)
 * - role        : UI 권한 분기용
 *
 * Refresh Token은 응답 바디 없이 서버가 Set-Cookie(HttpOnly)로만 전달합니다.
 */
export type LoginResponseDto = {
  /** 단기 JWT 액세스 토큰 (15분) */
  accessToken: string;
  /** 사용자 역할 */
  role: Role;
};

/**
 * POST /auth/refresh 응답 바디
 * api.ts가 401 수신 시 자동으로 호출하며, 새 Access Token과 역할을 메모리에 저장합니다.
 */
export type RefreshResponseDto = {
  /** 새로 발급된 Access Token */
  accessToken: string;
  /** 사용자 역할 (메모리 복구용) */
  role: Role;
};

/**
 * 사용자 역할
 * - "admin" : 포트폴리오 생성/수정/삭제 가능
 * - "guest" : 읽기 전용
 */
export type Role = "admin" | "guest";
