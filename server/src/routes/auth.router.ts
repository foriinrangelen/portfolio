import { Hono } from 'hono';
import { container } from 'tsyringe';
import { AuthController } from '../controllers/auth.controller';

export default function authRouter() {
	const ctrl = container.resolve(AuthController);

	const r = new Hono();

	/* auth 관련 API */
	r.post('/login', ctrl.login);

	r.post('/logout', (c) => {
		const isSecure = c.req.url.startsWith('https');
		c.header('Set-Cookie', ['session_token=', 'Path=/', 'HttpOnly', 'SameSite=None', 'Max-Age=0', ...(isSecure ? ['Secure'] : [])].join('; '));
		return c.json({ ok: true });
	});

	return r;
}
