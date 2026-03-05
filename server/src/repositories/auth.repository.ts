import { Context } from 'hono';
import { injectable } from 'tsyringe';

@injectable()
export class AuthRepository {
	async findByCredentials(c: Context, username: string, password: string) {
		return c.env.db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').bind(username, password).first();
	}
}
