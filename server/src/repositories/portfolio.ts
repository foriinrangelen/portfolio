import type { Portfolio, PortfolioRow, SectionRow, TechRow } from '../types';

export class PortfolioRepository {
	constructor(private db: D1Database) {}

	async findAll(): Promise<PortfolioRow[]> {
		const result = await this.db.prepare('SELECT * FROM portfolios ORDER BY created_at DESC').all<PortfolioRow>();
		return result.results ?? [];
	}

	async findById(id: string): Promise<PortfolioRow | null> {
		return this.db.prepare('SELECT * FROM portfolios WHERE id = ?').bind(id).first<PortfolioRow>();
	}

	async exists(id: string): Promise<boolean> {
		const row = await this.db.prepare('SELECT id FROM portfolios WHERE id = ?').bind(id).first();
		return !!row;
	}

	async insert(data: Portfolio): Promise<void> {
		await this.db
			.prepare('INSERT INTO portfolios (id, title, description, detail, body, url, github) VALUES (?, ?, ?, ?, ?, ?, ?)')
			.bind(data.id, data.title, data.description ?? '', data.detail ?? '', data.body ?? '', data.url ?? '', data.github ?? null)
			.run();
	}

	async update(id: string, data: Portfolio): Promise<void> {
		await this.db
			.prepare(
				`UPDATE portfolios
         SET title = ?, description = ?, detail = ?, body = ?, url = ?, github = ?, updated_at = datetime('now')
         WHERE id = ?`,
			)
			.bind(data.title, data.description ?? '', data.detail ?? '', data.body ?? '', data.url ?? '', data.github ?? null, id)
			.run();
	}

	async deleteById(id: string): Promise<void> {
		await this.db.batch([
			this.db.prepare('DELETE FROM portfolio_sections WHERE portfolio_id = ?').bind(id),
			this.db.prepare('DELETE FROM portfolio_techs WHERE portfolio_id = ?').bind(id),
			this.db.prepare('DELETE FROM portfolios WHERE id = ?').bind(id),
		]);
	}

	async findSections(portfolioId: string): Promise<SectionRow[]> {
		const result = await this.db.prepare('SELECT * FROM portfolio_sections WHERE portfolio_id = ? ORDER BY sort_order').bind(portfolioId).all<SectionRow>();
		return result.results ?? [];
	}

	async findTechs(portfolioId: string): Promise<TechRow[]> {
		const result = await this.db.prepare('SELECT * FROM portfolio_techs WHERE portfolio_id = ? ORDER BY sort_order').bind(portfolioId).all<TechRow>();
		return result.results ?? [];
	}

	async replaceSectionsAndTechs(portfolioId: string, sections: Portfolio['sections'], techs: Portfolio['techs']): Promise<void> {
		const stmts: ReturnType<D1Database['prepare']>[] = [this.db.prepare('DELETE FROM portfolio_sections WHERE portfolio_id = ?').bind(portfolioId), this.db.prepare('DELETE FROM portfolio_techs WHERE portfolio_id = ?').bind(portfolioId)];

		sections?.forEach((s, i) => {
			stmts.push(this.db.prepare('INSERT INTO portfolio_sections (id, portfolio_id, title, body, image, sort_order) VALUES (?, ?, ?, ?, ?, ?)').bind(s.id, portfolioId, s.title, s.body, s.image ?? null, i));
		});

		techs?.forEach((t, i) => {
			stmts.push(this.db.prepare('INSERT INTO portfolio_techs (portfolio_id, name, version, icon, sort_order) VALUES (?, ?, ?, ?, ?)').bind(portfolioId, t.name, t.version, t.icon, i));
		});

		if (stmts.length > 0) await this.db.batch(stmts);
	}
}
