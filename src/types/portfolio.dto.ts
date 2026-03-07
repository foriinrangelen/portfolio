/**
 * portfolio.dto.ts
 * 포트폴리오 관련 API 응답/요청 타입 정의
 *
 * 백엔드 API와 1:1로 대응되는 클라이언트 측 DTO입니다.
 * lib/api.ts 및 컴포넌트에서 이 타입을 import하여 사용합니다.
 */

/**
 * 기술 스택 DTO
 * 포트폴리오에 사용된 기술 하나를 나타냅니다.
 */
export type TechDto = {
  /** 기술 이름 (예: "TypeScript", "React") */
  name: string;
  /** 버전 문자열 (예: "5.0", "19") */
  version: string;
  /** 아이콘 식별자 — TechIcon 컴포넌트에서 사용 (예: "typescript") */
  icon: string;
};

/**
 * 섹션 DTO
 * 포트폴리오 내 하나의 글 단위 (제목 + 본문 + 선택적 이미지)
 */
export type SectionDto = {
  /** 섹션 고유 ID */
  id: string;
  /** 섹션 제목 */
  title: string;
  /** 섹션 본문 (마크다운 형식) */
  body: string;
  /** 첨부 이미지 URL (없으면 생략) */
  image?: string;
};

/**
 * 포트폴리오 DTO
 * GET /portfolios, GET /portfolios/:id 응답 및
 * POST /portfolios, PUT /portfolios/:id 요청 바디로 사용
 */
export type PortfolioDto = {
  /** 고유 ID (예: "my-project-1717000000000") */
  id: string;
  /** 포트폴리오 제목 */
  title: string;
  /** 목록 카드에 표시되는 한 줄 설명 */
  description: string;
  /** 상세 페이지 상단의 요약 설명 */
  detail: string;
  /** 상세 본문 (마크다운 형식) */
  body: string;
  /** 섹션 목록 — 없을 수도 있음 */
  sections?: SectionDto[];
  /** 사용 기술 스택 목록 */
  techs: TechDto[];
  /** 배포된 서비스 URL */
  url: string;
  /** GitHub 저장소 URL (없으면 생략) */
  github?: string;
};
