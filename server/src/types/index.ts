/**
 * types/index.ts
 * 백엔드 전체에서 사용하는 타입의 진입점(barrel)
 *
 * - HonoEnv  : Hono 앱에 바인딩되는 환경 변수 및 컨텍스트 변수 타입
 * - DTO 타입 : portfolio.dto, auth.dto 에서 re-export
 */

/* ── Hono 환경 타입 ─────────────────────────────────────── */

/**
 * Cloudflare Workers 환경 변수 (wrangler.toml의 [vars] 및 Bindings)
 * Hono 앱 전반에서 `c.env.*` 로 접근
 */
type Bindings = {
  /** Cloudflare D1 데이터베이스 인스턴스 */
  DB: D1Database;
  /** JWT 서명/검증용 비밀키 (Secret) */
  JWT_SECRET: string;
};

/**
 * Hono Context 변수 (`c.get() / c.set()` 으로 접근)
 * authMiddleware 에서 설정하고 requireAdmin 등에서 읽음
 */
type Variables = {
  /**
   * 인증된 사용자 정보
   * 미인증 요청이면 null
   */
  user: { id: string; role: "admin" | "guest" } | null;
};

/**
 * Hono 앱의 제네릭 환경 타입
 * `new Hono<HonoEnv>()` 형태로 사용
 *
 * @example
 * const app = new Hono<HonoEnv>();
 * app.get('/', (c) => {
 *   const db = c.env.DB;        // D1Database
 *   const user = c.get('user'); // { id, role } | null
 * });
 */
export type HonoEnv = {
  Bindings: Bindings;
  Variables: Variables;
};

/* ── DTO re-export ──────────────────────────────────────── */

export type {
  Tech,
  TechRow,
  Section,
  SectionRow,
  Portfolio,
  PortfolioRow,
} from "./portfolio.dto";

export type {
  LoginRequestDto,
  LoginResponseDto,
  LogoutResponseDto,
  JwtPayload,
  UserRow,
} from "./auth.dto";
