import cache from "@adonisjs/cache/services/main";
import logger from "@adonisjs/core/services/logger";

/**
 * Cache options
 */
export interface CacheOptions {
	ttl?: number; // Time to live in seconds
	keyPrefix?: string;
	keyGenerator?: (...args: unknown[]) => string;
}

const defaultOptions: CacheOptions = {
	ttl: 300, // 5 minutes
	keyPrefix: "cache",
};

/**
 * Caching Decorator
 * Wraps service methods to add caching capabilities.
 */
export class CachingDecorator<T extends object> {
	private serviceName: string;
	private options: CacheOptions;

	constructor(_service: T, serviceName?: string, options: CacheOptions = {}) {
		this.serviceName = serviceName ?? "Service";
		this.options = { ...defaultOptions, ...options };
	}

	/**
	 * Wrap a method with caching
	 */
	wrapMethod<R>(
		methodName: string,
		method: (...args: unknown[]) => Promise<R>,
		methodOptions?: CacheOptions,
	): (...args: unknown[]) => Promise<R> {
		const { serviceName, options } = this;
		const mergedOptions = { ...options, ...methodOptions };

		return async (...args: unknown[]): Promise<R> => {
			const cacheKey = this.generateCacheKey(methodName, args, mergedOptions);

			try {
				// Try to get from cache using AdonisJS cache API
				const cached = await cache.get<R>({ key: cacheKey });
				if (cached !== null && cached !== undefined) {
					logger.debug(`[${serviceName}] Cache hit for ${methodName}`, {
						cacheKey,
					});
					return cached;
				}
			} catch (error) {
				logger.warn(`[${serviceName}] Cache read failed for ${methodName}`, {
					cacheKey,
					error: (error as Error).message,
				});
			}

			// Execute method
			const result = await method(...args);

			// Store in cache using AdonisJS cache API
			try {
				await cache.set({
					key: cacheKey,
					value: result,
					ttl: `${mergedOptions.ttl}s`,
				});
				logger.debug(`[${serviceName}] Cached result for ${methodName}`, {
					cacheKey,
					ttl: mergedOptions.ttl,
				});
			} catch (error) {
				logger.warn(`[${serviceName}] Cache write failed for ${methodName}`, {
					cacheKey,
					error: (error as Error).message,
				});
			}

			return result;
		};
	}

	/**
	 * Generate cache key for a method call
	 */
	private generateCacheKey(
		methodName: string,
		args: unknown[],
		options: CacheOptions,
	): string {
		if (options.keyGenerator) {
			return options.keyGenerator(...args);
		}

		const argsHash = this.hashArgs(args);
		return `${options.keyPrefix}:${this.serviceName}:${methodName}:${argsHash}`;
	}

	/**
	 * Create a hash from method arguments
	 */
	private hashArgs(args: unknown[]): string {
		if (args.length === 0) return "noargs";
		try {
			const json = JSON.stringify(args);
			// Simple hash function
			let hash = 0;
			for (let i = 0; i < json.length; i++) {
				const char = json.charCodeAt(i);
				hash = (hash << 5) - hash + char;
				hash = hash & hash;
			}
			return Math.abs(hash).toString(36);
		} catch {
			return "unknown";
		}
	}

	/**
	 * Invalidate cache for a specific method
	 */
	async invalidate(methodName: string, args?: unknown[]): Promise<void> {
		const cacheKey = args
			? this.generateCacheKey(methodName, args, this.options)
			: `${this.options.keyPrefix}:${this.serviceName}:${methodName}:noargs`;

		try {
			await cache.delete({ key: cacheKey });
			logger.debug(`[${this.serviceName}] Invalidated cache`, {
				key: cacheKey,
			});
		} catch (error) {
			logger.warn(`[${this.serviceName}] Cache invalidation failed`, {
				key: cacheKey,
				error: (error as Error).message,
			});
		}
	}
}

/**
 * Create a cached version of a specific method
 */
export function withCaching<T extends object, R>(
	service: T,
	methodName: keyof T,
	options?: CacheOptions,
): (...args: unknown[]) => Promise<R> {
	const decorator = new CachingDecorator(service, undefined, options);
	const method = service[methodName] as (...args: unknown[]) => Promise<R>;
	return decorator.wrapMethod(methodName as string, method.bind(service));
}

/**
 * Method decorator for caching (for use with class methods)
 * Usage: @cached({ ttl: 300 }) on async methods
 */
export function cached(options: CacheOptions = {}) {
	return (
		_target: object,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	): PropertyDescriptor => {
		const originalMethod = descriptor.value;
		const mergedOptions = { ...defaultOptions, ...options };

		descriptor.value = async function (...args: unknown[]) {
			const serviceName = this.constructor.name;
			const decorator = new CachingDecorator(this, serviceName, mergedOptions);
			const wrappedMethod = decorator.wrapMethod(
				propertyKey,
				originalMethod.bind(this),
			);
			return wrappedMethod(...args);
		};

		return descriptor;
	};
}

export default CachingDecorator;
