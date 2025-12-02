import { Exception } from "@adonisjs/core/exceptions";

/**
 * Base exception class for all application exceptions.
 * Provides consistent error handling with HTTP status codes and error codes.
 */
export default class BaseException extends Exception {
	/**
	 * Unique error code for client-side error handling
	 */
	declare code: string;

	/**
	 * Additional context for debugging
	 */
	declare context?: Record<string, unknown>;

	constructor(
		message: string,
		options: {
			code: string;
			status?: number;
			context?: Record<string, unknown>;
		},
	) {
		super(message, { status: options.status || 500, code: options.code });
		this.context = options.context;
	}

	/**
	 * Convert exception to JSON for API responses
	 */
	toJSON() {
		return {
			error: {
				code: this.code,
				message: this.message,
				...(this.context && { context: this.context }),
			},
		};
	}
}
