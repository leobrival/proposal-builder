import type Proposal from "#models/proposal";

/**
 * Export data structure for proposals
 */
export interface ProposalExportData {
	id: string;
	title: string;
	projectName: string;
	status: string;
	contactEmail: string;
	viewCount: number;
	createdAt: string;
	publishedAt: string | null;
	tiers?: TierExportData[];
}

export interface TierExportData {
	name: string;
	price: number;
	currency: string;
	description: string | null;
	benefits: string[];
}

/**
 * Export Strategy Interface
 * Defines the contract for different export formats.
 */
export interface ExportStrategy {
	/**
	 * Export a single proposal
	 */
	export(proposal: Proposal): Promise<string>;

	/**
	 * Export multiple proposals
	 */
	exportMany(proposals: Proposal[]): Promise<string>;

	/**
	 * Get the file extension for this export format
	 */
	getFileExtension(): string;

	/**
	 * Get the MIME type for this export format
	 */
	getMimeType(): string;
}

/**
 * JSON Export Strategy
 */
export class JsonExportStrategy implements ExportStrategy {
	async export(proposal: Proposal): Promise<string> {
		const data = await this.toExportData(proposal);
		return JSON.stringify(data, null, 2);
	}

	async exportMany(proposals: Proposal[]): Promise<string> {
		const data = await Promise.all(proposals.map((p) => this.toExportData(p)));
		return JSON.stringify(data, null, 2);
	}

	getFileExtension(): string {
		return "json";
	}

	getMimeType(): string {
		return "application/json";
	}

	private async toExportData(proposal: Proposal): Promise<ProposalExportData> {
		await proposal.load("tiers", (query) => {
			query.preload("benefits");
		});

		return {
			id: proposal.id,
			title: proposal.title,
			projectName: proposal.projectName,
			status: proposal.status,
			contactEmail: proposal.contactEmail,
			viewCount: proposal.viewCount,
			createdAt: proposal.createdAt.toISO() ?? "",
			publishedAt: proposal.publishedAt?.toISO() ?? null,
			tiers: proposal.tiers?.map((tier) => ({
				name: tier.name,
				price: tier.price,
				currency: tier.currency,
				description: tier.description,
				benefits: tier.benefits?.map((b) => b.description) ?? [],
			})),
		};
	}
}

/**
 * CSV Export Strategy
 */
export class CsvExportStrategy implements ExportStrategy {
	private separator = ",";

	async export(proposal: Proposal): Promise<string> {
		return this.exportMany([proposal]);
	}

	async exportMany(proposals: Proposal[]): Promise<string> {
		const headers = [
			"ID",
			"Title",
			"Project Name",
			"Status",
			"Contact Email",
			"View Count",
			"Created At",
			"Published At",
		];

		const rows = proposals.map((proposal) => [
			this.escapeField(proposal.id),
			this.escapeField(proposal.title),
			this.escapeField(proposal.projectName),
			this.escapeField(proposal.status),
			this.escapeField(proposal.contactEmail),
			String(proposal.viewCount),
			proposal.createdAt.toISO() ?? "",
			proposal.publishedAt?.toISO() ?? "",
		]);

		return [
			headers.join(this.separator),
			...rows.map((row) => row.join(this.separator)),
		].join("\n");
	}

	getFileExtension(): string {
		return "csv";
	}

	getMimeType(): string {
		return "text/csv";
	}

	private escapeField(value: string): string {
		if (
			value.includes(this.separator) ||
			value.includes('"') ||
			value.includes("\n")
		) {
			return `"${value.replace(/"/g, '""')}"`;
		}
		return value;
	}
}

/**
 * Markdown Export Strategy
 */
export class MarkdownExportStrategy implements ExportStrategy {
	async export(proposal: Proposal): Promise<string> {
		await proposal.load("tiers", (query) => {
			query.preload("benefits");
		});

		const lines: string[] = [
			`# ${proposal.title}`,
			"",
			`**Project:** ${proposal.projectName}`,
			`**Status:** ${proposal.status}`,
			`**Contact:** ${proposal.contactEmail}`,
			`**Views:** ${proposal.viewCount}`,
			`**Created:** ${proposal.createdAt.toFormat("yyyy-MM-dd")}`,
		];

		if (proposal.publishedAt) {
			lines.push(
				`**Published:** ${proposal.publishedAt.toFormat("yyyy-MM-dd")}`,
			);
		}

		if (proposal.description) {
			lines.push("", "## Description", "", proposal.description);
		}

		if (proposal.tiers && proposal.tiers.length > 0) {
			lines.push("", "## Sponsorship Tiers", "");

			for (const tier of proposal.tiers) {
				lines.push(`### ${tier.name} - ${tier.price} ${tier.currency}`, "");

				if (tier.description) {
					lines.push(tier.description, "");
				}

				if (tier.benefits && tier.benefits.length > 0) {
					lines.push("**Benefits:**", "");
					for (const benefit of tier.benefits) {
						lines.push(`- ${benefit.description}`);
					}
					lines.push("");
				}
			}
		}

		return lines.join("\n");
	}

	async exportMany(proposals: Proposal[]): Promise<string> {
		const exports = await Promise.all(proposals.map((p) => this.export(p)));
		return exports.join("\n\n---\n\n");
	}

	getFileExtension(): string {
		return "md";
	}

	getMimeType(): string {
		return "text/markdown";
	}
}

/**
 * Export Service using Strategy Pattern
 */
export class ExportService {
	private strategy: ExportStrategy;

	constructor(strategy: ExportStrategy = new JsonExportStrategy()) {
		this.strategy = strategy;
	}

	setStrategy(strategy: ExportStrategy): void {
		this.strategy = strategy;
	}

	async export(proposal: Proposal): Promise<string> {
		return this.strategy.export(proposal);
	}

	async exportMany(proposals: Proposal[]): Promise<string> {
		return this.strategy.exportMany(proposals);
	}

	getFileExtension(): string {
		return this.strategy.getFileExtension();
	}

	getMimeType(): string {
		return this.strategy.getMimeType();
	}
}

/**
 * Factory function for creating export strategies
 */
export function createExportStrategy(
	format: "json" | "csv" | "markdown",
): ExportStrategy {
	switch (format) {
		case "csv":
			return new CsvExportStrategy();
		case "markdown":
			return new MarkdownExportStrategy();
		case "json":
		default:
			return new JsonExportStrategy();
	}
}

export default ExportService;
