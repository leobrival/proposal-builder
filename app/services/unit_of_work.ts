import db from "@adonisjs/lucid/services/db";
import type { TransactionClientContract } from "@adonisjs/lucid/types/database";

/**
 * Unit of Work Pattern
 * Manages database transactions for operations involving multiple entities.
 * Ensures atomic operations with automatic rollback on failure.
 */
class UnitOfWork {
	private trx: TransactionClientContract | null = null;
	private isCompleted = false;

	/**
	 * Begin a new transaction
	 * @throws Error if transaction is already started
	 */
	async begin(): Promise<void> {
		if (this.trx) {
			throw new Error("Transaction already started");
		}
		this.trx = await db.transaction();
		this.isCompleted = false;
	}

	/**
	 * Commit the current transaction
	 * @throws Error if no transaction is active
	 */
	async commit(): Promise<void> {
		if (!this.trx) {
			throw new Error("No active transaction to commit");
		}
		if (this.isCompleted) {
			throw new Error("Transaction already completed");
		}
		await this.trx.commit();
		this.isCompleted = true;
		this.trx = null;
	}

	/**
	 * Rollback the current transaction
	 * @throws Error if no transaction is active
	 */
	async rollback(): Promise<void> {
		if (!this.trx) {
			throw new Error("No active transaction to rollback");
		}
		if (this.isCompleted) {
			throw new Error("Transaction already completed");
		}
		await this.trx.rollback();
		this.isCompleted = true;
		this.trx = null;
	}

	/**
	 * Get the current transaction client
	 * @throws Error if no transaction is active
	 */
	get transaction(): TransactionClientContract {
		if (!this.trx) {
			throw new Error("No active transaction. Call begin() first.");
		}
		return this.trx;
	}

	/**
	 * Check if a transaction is active
	 */
	get isActive(): boolean {
		return this.trx !== null && !this.isCompleted;
	}

	/**
	 * Execute a function within a transaction context.
	 * Automatically commits on success or rolls back on failure.
	 * @param fn - Function to execute within the transaction
	 * @returns Result of the function
	 */
	async execute<T>(
		fn: (trx: TransactionClientContract) => Promise<T>,
	): Promise<T> {
		await this.begin();
		try {
			const result = await fn(this.transaction);
			await this.commit();
			return result;
		} catch (error) {
			await this.rollback();
			throw error;
		}
	}
}

/**
 * Factory function to create a new UnitOfWork instance
 */
export function createUnitOfWork(): UnitOfWork {
	return new UnitOfWork();
}

/**
 * Execute a function within a transaction context.
 * Convenience function for one-off transactional operations.
 * @param fn - Function to execute within the transaction
 * @returns Result of the function
 */
export async function withTransaction<T>(
	fn: (trx: TransactionClientContract) => Promise<T>,
): Promise<T> {
	const uow = createUnitOfWork();
	return uow.execute(fn);
}

export default UnitOfWork;
