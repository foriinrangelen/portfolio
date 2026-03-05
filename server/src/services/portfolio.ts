import { HTTPException } from 'hono/http-exception';
import { PortfolioRepository } from '../repositories/portfolio';
import type { Portfolio } from '../types';

export class PortfolioService {
	private repo: PortfolioRepository;

	constructor(db: D1Database) {
		this.repo = new PortfolioRepository(db);
	}

	async getAll(): Promise<Portfolio[]> {
		const rows = await this.repo.findAll();
		return Promise.all(rows.map((row) => this.buildPortfolio(row.id)));
	}

	async getById(id: string): Promise<Portfolio> {
		const row = await this.repo.findById(id);
		if (!row) throw new HTTPException(404, { message: 'Portfolio not found' });
		return this.buildPortfolio(id);
	}

	async create(data: Portfolio): Promise<Portfolio> {
		if (!data.id || !data.title) {
			throw new HTTPException(400, { message: 'id and title are required' });
		}

		if (await this.repo.exists(data.id)) {
			throw new HTTPException(409, { message: 'Portfolio already exists' });
		}

		await this.repo.insert(data);
		await this.repo.replaceSectionsAndTechs(data.id, data.sections, data.techs);
		return this.buildPortfolio(data.id);
	}

	async update(id: string, data: Portfolio): Promise<Portfolio> {
		if (!(await this.repo.exists(id))) {
			throw new HTTPException(404, { message: 'Portfolio not found' });
		}

		await this.repo.update(id, data);
		await this.repo.replaceSectionsAndTechs(id, data.sections, data.techs);
		return this.buildPortfolio(id);
	}

	async remove(id: string): Promise<void> {
		if (!(await this.repo.exists(id))) {
			throw new HTTPException(404, { message: 'Portfolio not found' });
		}
		await this.repo.deleteById(id);
	}

	private async buildPortfolio(id: string): Promise<Portfolio> {
		const [row, sections, techs] = await Promise.all([this.repo.findById(id), this.repo.findSections(id), this.repo.findTechs(id)]);

		if (!row) throw new HTTPException(404, { message: 'Portfolio not found' });

		return {
			id: row.id,
			title: row.title,
			description: row.description,
			detail: row.detail,
			body: row.body,
			url: row.url,
			...(row.github ? { github: row.github } : {}),
			sections: sections.map((s) => ({
				id: s.id,
				title: s.title,
				body: s.body,
				...(s.image ? { image: s.image } : {}),
			})),
			techs: techs.map((t) => ({
				name: t.name,
				version: t.version,
				icon: t.icon,
			})),
		};
	}
}
