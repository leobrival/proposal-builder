import { defineConfig, drivers, store } from "@adonisjs/cache";

const cacheConfig = defineConfig({
	default: "redis",

	stores: {
		/**
		 * Redis cache via Upstash (EU)
		 * - Automatic TTL managed by Redis
		 * - Persistent across restarts
		 * - Shared between instances
		 */
		redis: store()
			.useL1Layer(
				drivers.memory({
					maxSize: "10mb",
					maxItems: 500,
				}),
			)
			.useL2Layer(
				drivers.redis({
					connectionName: "main",
				}),
			),

		/**
		 * Memory-only cache (fallback)
		 */
		memory: store().useL1Layer(
			drivers.memory({
				maxSize: "50mb",
				maxItems: 1000,
			}),
		),
	},
});

export default cacheConfig;

declare module "@adonisjs/cache/types" {
	interface CacheStores extends InferStores<typeof cacheConfig> {}
}
