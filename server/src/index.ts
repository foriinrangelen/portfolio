import 'reflect-metadata';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { authMiddleware } from './middlewares/auth';
import authRouter from './routes/auth.router';
import portfoliosRouter from './routes/portfolios';
import { configureContainer } from './di/container';
import type { HonoEnv } from './types';

/** 클라이언트 측 허용 Origin 목록 */
const ALLOWED_ORIGINS = ['http://localhost:5173', 'http://localhost:3000', 'https://portfolio2.kyyyy8629.pages.dev'];

configureContainer();
const app = new Hono<HonoEnv>();

/* ── CORS ──────────────────────────────────────────────── */
app.use(
	'*',
	cors({
		origin: (origin) => (ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]),
		allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
		maxAge: 86400,
	}),
);
app.options('*', (c) => c.body(null, 204));

/* ── 전역 에러 핸들러 ───────────────────────────────────── */
app.onError((err, c) => {
	// HTTPException은 status + message 그대로 반환
	if (err instanceof HTTPException) {
		return c.json({ success: false, data: err.message }, err.status);
	}

	// 예상치 못한 오류는 로그 기록 후 500 반환
	console.error(
		'ERROR:',
		JSON.stringify({
			ts: new Date().toISOString(),
			url: c.req.url,
			method: c.req.method,
			message: err.message,
			stack: err.stack,
		}),
	);

	return c.json({ success: false, data: 'Internal Server Error' }, 500);
});

/* ── 인증 미들웨어 (전역) ────────────────────────────────── */
// 모든 요청에서 JWT / 쿠키 토큰을 검증해 c.get('user')에 사용자 정보를 설정
app.use('*', authMiddleware);

/* ── 라우트 ─────────────────────────────────────────────── */
// POST /auth/login  — 로그인
// POST /auth/logout — 로그아웃
app.route('/auth', authRouter());

// GET    /portfolios       — 포트폴리오 목록 조회 (공개)
// GET    /portfolios/:id   — 포트폴리오 상세 조회 (공개)
// POST   /portfolios       — 포트폴리오 생성 (admin 전용)
// PUT    /portfolios/:id   — 포트폴리오 수정 (admin 전용)
// DELETE /portfolios/:id   — 포트폴리오 삭제 (admin 전용)
app.route('/portfolios', portfoliosRouter);

export default app;
