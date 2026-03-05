import { injectable, inject } from 'tsyringe';
import { HTTPException } from 'hono/http-exception';
import { AuthRepository } from '../repositories/auth.repository';
import { createToken } from '../lib/jwt';
import { Context } from 'hono';

@injectable()
export class AuthService {
	constructor(@inject(AuthRepository) private repo: AuthRepository) {}

	async login(c: Context, username: string, password: string) {
		const user = await this.repo.findByCredentials(c.env.DB, username, password);
		if (!user) throw new HTTPException(401, { message: 'Invalid credentials' });
		const { role } = user;

		const token = await createToken({ id: username, role }, c.env.JWT_SECRET);

		return { token, role: user.role };
	}
}
