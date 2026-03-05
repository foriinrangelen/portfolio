import { Hono } from 'hono';
import type { HonoEnv, Portfolio } from '../types';
import { requireAdmin } from '../middlewares/auth';
import { PortfolioService } from '../services/portfolio';

const portfolios = new Hono<HonoEnv>();

portfolios.get('/', async (c) => {
	const service = new PortfolioService(c.env.DB);
	return c.json(await service.getAll());
});

portfolios.get('/:id', async (c) => {
	const service = new PortfolioService(c.env.DB);
	return c.json(await service.getById(c.req.param('id')));
});

portfolios.post('/', requireAdmin, async (c) => {
	const service = new PortfolioService(c.env.DB);
	const body = await c.req.json<Portfolio>();
	return c.json(await service.create(body), 201);
});

portfolios.put('/:id', requireAdmin, async (c) => {
	const service = new PortfolioService(c.env.DB);
	const body = await c.req.json<Portfolio>();
	return c.json(await service.update(c.req.param('id'), body));
});

portfolios.delete('/:id', requireAdmin, async (c) => {
	const service = new PortfolioService(c.env.DB);
	await service.remove(c.req.param('id'));
	return c.json({ ok: true });
});

export default portfolios;
