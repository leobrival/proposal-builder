import { defineConfig } from "@adonisjs/redis";
import type { InferConnections } from "@adonisjs/redis/types";
import env from "#start/env";

const redisConfig = defineConfig({
	connection: "main",

	connections: {
		/**
		 * Upstash Redis (EU) - Cache for dashboard metrics
		 * TLS is required for Upstash
		 */
		main: {
			host: env.get("REDIS_HOST"),
			port: env.get("REDIS_PORT"),
			password: env.get("REDIS_PASSWORD", ""),
			db: 0,
			keyPrefix: "spons-easy:",
			tls: {
				rejectUnauthorized: true,
			},
			retryStrategy(times) {
				return times > 10 ? null : times * 50;
			},
		},
	},
});

export default redisConfig;

declare module "@adonisjs/redis/types" {
	export interface RedisConnections
		extends InferConnections<typeof redisConfig> {}
}
