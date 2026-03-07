/**
 * auth.dto.ts
 * 인증(Authentication) 관련 요청/응답 DTO 정의
 *
 * lib/api.ts의 login 함수 및 lib/auth.ts에서 import하여 사용합니다.
 */

/**
 * POST /auth/login 요청 바디
 * 로그인 폼에서 수집한 데이터를 그대로 전송
 */
export type LoginRequestDto = {
  /** 사용자 이름 */
  username: string;
  /** 비밀번호 */
  password: string;
};

/**
 * POST /auth/login 응답 바디
 * 로그인 성공 시 서버가 반환하는 데이터
 *
 * - token : localStorage에 저장 후 Authorization: Bearer 헤더로 사용
 * - role  : "admin"이면 편집/삭제 버튼 노출, "guest"이면 읽기 전용
 */
export type LoginResponseDto = {
  /** JWT 액세스 토큰 */
  token: string;
  /** 사용자 역할 */
  role: Role;
};

/**
 * 사용자 역할
 * - "admin" : 포트폴리오 생성/수정/삭제 권한 보유
 * - "guest" : 읽기 전용
 */
export type Role = "admin" | "guest";
