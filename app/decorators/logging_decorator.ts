import logger from "@adonisjs/core/services/logger";

/**
 * Method execution metadata
 */
export interface MethodExecutionMeta {
	methodName: string;
	args: unknown[];
	startTime: number;
	endTime?: number;
	duration?: number;
	success: boolean;
	error?: Error;
}

/**
 * Logging options
 */
export interface LoggingOptions {
	logArgs?: boolean;
	logResult?: boolean;
	logDuration?: boolean;
	level?: "debug" | "info" | "warn" | "error";
}

const defaultOptions: LoggingOptions = {
	logArgs: false,
	logResult: false,
	logDuration: true,
	level: "info",
};

/**
 * Logging Decorator
 * Wraps service methods to add logging capabilities.
 */
export class LoggingDecorator<T extends object> {
	private serviceName: string;
	private options: LoggingOptions;

	constructor(
		private service: T,
		serviceName?: string,
		options: LoggingOptions = {},
	) {
		this.serviceName = serviceName ?? service.constructor.name;
		this.options = { ...defaultOptions, ...options };
	}

	/**
	 * Create a proxy that logs all method calls
	 */
	createProxy(): T {
		return new Proxy(this.service, {
			get: (target, prop: string | symbol) => {
				const value = target[prop as keyof T];

				if (typeof value === "function") {
					return this.wrapMethod(prop.toString(), value.bind(target));
				}

				return value;
			},
		});
	}

	/**
	 * Wrap a specific method with logging
	 */
	wrapMethod<R>(
		methodName: string,
		method: (...args: unknown[]) => Promise<R>,
	): (...args: unknown[]) => Promise<R> {
		const { serviceName, options } = this;

		return async (...args: unknown[]): Promise<R> => {
			const meta: MethodExecutionMeta = {
				methodName,
				args,
				startTime: Date.now(),
				success: false,
			};

			const logContext: Record<string, unknown> = {
				service: serviceName,
				method: methodName,
			};

			if (options.logArgs) {
				logContext.args = args;
			}

			logger[options.level!](
				`[${serviceName}] Calling ${methodName}`,
				logContext,
			);

			try {
				const result = await method(...args);

				meta.endTime = Date.now();
				meta.duration = meta.endTime - meta.startTime;
				meta.success = true;

				const successContext: Record<string, unknown> = {
					service: serviceName,
					method: methodName,
				};

				if (options.logDuration) {
					successContext.duration = `${meta.duration}ms`;
				}

				if (options.logResult) {
					successContext.result = result;
				}

				logger[options.level!](
					`[${serviceName}] ${methodName} completed`,
					successContext,
				);

				return result;
			} catch (error) {
				meta.endTime = Date.now();
				meta.duration = meta.endTime - meta.startTime;
				meta.success = false;
				meta.error = error as Error;

				logger.error(`[${serviceName}] ${methodName} failed`, {
					service: serviceName,
					method: methodName,
					duration: `${meta.duration}ms`,
					error: (error as Error).message,
					stack: (error as Error).stack,
				});

				throw error;
			}
		};
	}
}

/**
 * Create a logged version of a service
 */
export function withLogging<T extends object>(
	service: T,
	serviceName?: string,
	options?: LoggingOptions,
): T {
	const decorator = new LoggingDecorator(service, serviceName, options);
	return decorator.createProxy();
}

/**
 * Method decorator for logging (for use with class methods)
 * Usage: @logMethod() on async methods
 */
export function logMethod(options: LoggingOptions = {}) {
	return (
		_target: object,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	): PropertyDescriptor => {
		const originalMethod = descriptor.value;
		const mergedOptions = { ...defaultOptions, ...options };

		descriptor.value = async function (...args: unknown[]) {
			const serviceName = this.constructor.name;
			const startTime = Date.now();

			const logContext: Record<string, unknown> = {
				service: serviceName,
				method: propertyKey,
			};

			if (mergedOptions.logArgs) {
				logContext.args = args;
			}

			logger[mergedOptions.level!](
				`[${serviceName}] Calling ${propertyKey}`,
				logContext,
			);

			try {
				const result = await originalMethod.apply(this, args);
				const duration = Date.now() - startTime;

				const successContext: Record<string, unknown> = {
					service: serviceName,
					method: propertyKey,
				};

				if (mergedOptions.logDuration) {
					successContext.duration = `${duration}ms`;
				}

				if (mergedOptions.logResult) {
					successContext.result = result;
				}

				logger[mergedOptions.level!](
					`[${serviceName}] ${propertyKey} completed`,
					successContext,
				);

				return result;
			} catch (error) {
				const duration = Date.now() - startTime;

				logger.error(`[${serviceName}] ${propertyKey} failed`, {
					service: serviceName,
					method: propertyKey,
					duration: `${duration}ms`,
					error: (error as Error).message,
				});

				throw error;
			}
		};

		return descriptor;
	};
}

export default LoggingDecorator;
