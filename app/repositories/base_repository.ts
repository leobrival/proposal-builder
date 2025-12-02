import type {
	LucidModel,
	LucidRow,
	ModelQueryBuilderContract,
} from "@adonisjs/lucid/types/model";

/**
 * Pagination options
 */
export interface PaginationOptions {
	page: number;
	perPage: number;
}

/**
 * Paginated result
 */
export interface PaginatedResult<T> {
	data: T[];
	meta: {
		total: number;
		perPage: number;
		currentPage: number;
		lastPage: number;
		firstPage: number;
	};
}

/**
 * Sort options
 */
export interface SortOptions {
	field: string;
	direction: "asc" | "desc";
}

/**
 * Base repository abstract class
 * Provides common CRUD operations for all repositories
 */
export default abstract class BaseRepository<T extends LucidRow> {
	protected abstract model: LucidModel;

	/**
	 * Get base query builder
	 */
	protected query(): ModelQueryBuilderContract<LucidModel, T> {
		return this.model.query() as ModelQueryBuilderContract<LucidModel, T>;
	}

	/**
	 * Find a record by ID
	 */
	async findById(id: string): Promise<T | null> {
		return this.query().where("id", id).first() as Promise<T | null>;
	}

	/**
	 * Find a record by ID or throw
	 */
	async findByIdOrFail(id: string): Promise<T> {
		return this.query().where("id", id).firstOrFail() as Promise<T>;
	}

	/**
	 * Find all records
	 */
	async findAll(): Promise<T[]> {
		return this.query().exec() as Promise<T[]>;
	}

	/**
	 * Find records with pagination
	 */
	async findPaginated(options: PaginationOptions): Promise<PaginatedResult<T>> {
		const result = await this.query().paginate(options.page, options.perPage);

		return {
			data: result.all() as T[],
			meta: {
				total: result.total,
				perPage: result.perPage,
				currentPage: result.currentPage,
				lastPage: result.lastPage,
				firstPage: result.firstPage,
			},
		};
	}

	/**
	 * Create a new record
	 */
	async create(data: Partial<T>): Promise<T> {
		return this.model.create(data) as Promise<T>;
	}

	/**
	 * Update a record
	 */
	async update(id: string, data: Partial<T>): Promise<T | null> {
		const record = await this.findById(id);
		if (!record) return null;

		(record as LucidRow).merge(data);
		await (record as LucidRow).save();
		return record;
	}

	/**
	 * Delete a record
	 */
	async delete(id: string): Promise<boolean> {
		const record = await this.findById(id);
		if (!record) return false;

		await (record as LucidRow).delete();
		return true;
	}

	/**
	 * Count all records
	 */
	async count(): Promise<number> {
		const result = await this.query().count("* as total");
		return Number(result[0].$extras.total) || 0;
	}

	/**
	 * Check if a record exists
	 */
	async exists(id: string): Promise<boolean> {
		const record = await this.findById(id);
		return record !== null;
	}
}
