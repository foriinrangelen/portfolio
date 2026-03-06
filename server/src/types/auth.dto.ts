/**
 * auth.dto.ts
 * 인증(Authentication) 관련 요청/응답 DTO 정의
 *
 * 클라이언트 ↔ 서버 간 주고받는 인증 데이터 구조를 명확하게 정의합니다.
 */

/**
 * POST /auth/login 요청 바디
 * 로그인 시 클라이언트가 전송하는 데이터
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
 * - token : 이후 API 요청의 Authorization 헤더에 사용 (Bearer 방식)
 * - role  : UI 권한 분기에 사용 ("admin" | "guest")
 */
export type LoginResponseDto = {
	/** JWT 액세스 토큰 */
	token: string;
	/** 사용자 역할 */
	role: 'admin' | 'guest';
};

/**
 * POST /auth/logout 응답 바디
 * 로그아웃 성공 응답
 */
export type LogoutResponseDto = {
	/** 성공 여부 */
	ok: true;
};

/**
 * JWT 페이로드
 * createToken / verifyToken 에서 사용하는 내부 페이로드 구조
 */
export type JwtPayload = {
	/** 사용자 식별자 (username) */
	id: string;
	/** 사용자 역할 */
	role: 'admin' | 'guest';
};

/**
 * users 테이블 행
 * DB에서 읽어온 사용자 원본 구조
 */
export type UserRow = {
	/** 사용자 이름 (PK) */
	username: string;
	/** 해시된 비밀번호 */
	password: string;
	/** 역할 */
	role: 'admin' | 'guest';
	/** 생성 일시 */
	created_at: string;
};
