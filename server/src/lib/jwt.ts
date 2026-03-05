import { sign, verify } from 'hono/jwt';

const TOKEN_EXP_SEC = 60 * 60 * 24; // 24h

export type JwtPayload = {
	id: string;
	role: string;
	exp: number;
	iat: number;
};

export async function createToken(payload: { id: string; role: string }, secret: string): Promise<string> {
	const now = Math.floor(Date.now() / 1000);
	return sign({ ...payload, iat: now, exp: now + TOKEN_EXP_SEC }, secret, 'HS256');
}

export async function verifyToken(token: string, secret: string): Promise<JwtPayload | null> {
	try {
		return (await verify(token, secret, 'HS256')) as JwtPayload;
	} catch {
		return null;
	}
}
