import { Context } from 'hono';
import { injectable, inject } from 'tsyringe';
import { AuthService } from '../services/auth.service';
import { HTTPException } from 'hono/http-exception';
import type { LoginRequestDto, LoginResponseDto } from '../types';

@injectable()
export class AuthController {
	constructor(@inject(AuthService) private s: AuthService) {}

	/**
	 * POST /auth/login
	 * 사용자 로그인 처리
	 *
	 * 1. username / password 검증
	 * 2. JWT 토큰 생성 후 HttpOnly 쿠키로 설정 (브라우저 자동 전송용)
	 * 3. 응답 바디에도 token + role 포함 (클라이언트 localStorage 저장용)
	 */
	login = async (c: Context<{ Bindings: Env }>) => {
		const { username, password } = await c.req.json<LoginRequestDto>();

		if (!username || !password) throw new HTTPException(400, { message: 'Username and password are required' });

		const { token, role } = await this.s.login(c, username, password);

		// HttpOnly 쿠키로 토큰 저장 (XSS 방어)
		const isSecure = c.req.url.startsWith('https');
		c.header('Set-Cookie', [`session_token=${token}`, 'Path=/', 'HttpOnly', 'SameSite=None', `Max-Age=${60 * 60 * 24}`, ...(isSecure ? ['Secure'] : [])].join('; '));

		// 응답 바디에도 token 포함 — 클라이언트가 Authorization 헤더용으로 사용
		return c.json<LoginResponseDto>({ token, role: role as 'admin' | 'guest' });
	};
}
