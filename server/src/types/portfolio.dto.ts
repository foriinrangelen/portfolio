/**
 * portfolio.dto.ts
 * 포트폴리오 관련 타입 정의
 *
 * - *Row 타입  : D1 데이터베이스에서 읽어온 원본 행(row) 구조
 * - 그 외 타입 : API 요청/응답에서 사용하는 도메인 모델(DTO)
 */

/* ── DB 원본 행 타입 ────────────────────────────────────── */

/**
 * portfolio_techs 테이블 행
 * DB에서 직접 읽어올 때 사용하는 타입
 */
export type TechRow = {
  /** 포트폴리오 ID (외래키) */
  portfolio_id: string;
  /** 기술 이름 (예: "TypeScript") */
  name: string;
  /** 버전 (예: "5.0") */
  version: string;
  /** 아이콘 식별자 (예: "typescript") */
  icon: string;
  /** 정렬 순서 */
  sort_order: number;
};

/**
 * portfolio_sections 테이블 행
 * DB에서 직접 읽어올 때 사용하는 타입
 */
export type SectionRow = {
  /** 섹션 고유 ID */
  id: string;
  /** 포트폴리오 ID (외래키) */
  portfolio_id: string;
  /** 섹션 제목 */
  title: string;
  /** 섹션 본문 (마크다운) */
  body: string;
  /** 첨부 이미지 URL (선택) */
  image: string | null;
  /** 정렬 순서 */
  sort_order: number;
};

/**
 * portfolios 테이블 행
 * DB에서 직접 읽어올 때 사용하는 타입
 */
export type PortfolioRow = {
  /** 포트폴리오 고유 ID (슬러그 형식) */
  id: string;
  /** 제목 */
  title: string;
  /** 간단한 설명 */
  description: string;
  /** 상세 요약 */
  detail: string;
  /** 본문 (마크다운) */
  body: string;
  /** 배포 URL */
  url: string;
  /** GitHub 저장소 URL (선택) */
  github: string | null;
  /** 생성 일시 */
  created_at: string;
  /** 수정 일시 */
  updated_at: string;
};

/* ── API 도메인 모델 (DTO) ──────────────────────────────── */

/**
 * 기술 스택 DTO
 * API 요청/응답 시 사용하는 기술 스택 객체
 */
export type Tech = {
  /** 기술 이름 (예: "TypeScript") */
  name: string;
  /** 버전 (예: "5.0") */
  version: string;
  /** 아이콘 식별자 (예: "typescript") */
  icon: string;
};

/**
 * 섹션 DTO
 * 포트폴리오 내 개별 섹션 (글 단위 구분)
 */
export type Section = {
  /** 섹션 고유 ID */
  id: string;
  /** 섹션 제목 */
  title: string;
  /** 섹션 본문 (마크다운) */
  body: string;
  /** 첨부 이미지 URL (선택) */
  image?: string;
};

/**
 * 포트폴리오 DTO
 * POST/PUT 요청 바디 및 GET 응답 바디로 사용
 */
export type Portfolio = {
  /** 고유 ID (슬러그 + 타임스탬프 형식) */
  id: string;
  /** 포트폴리오 제목 */
  title: string;
  /** 목록에 표시되는 간단한 설명 */
  description: string;
  /** 상세 페이지 요약 */
  detail: string;
  /** 본문 (마크다운) */
  body: string;
  /** 섹션 목록 (선택) */
  sections?: Section[];
  /** 사용 기술 스택 */
  techs: Tech[];
  /** 배포된 서비스 URL */
  url: string;
  /** GitHub 저장소 URL (선택) */
  github?: string;
};
