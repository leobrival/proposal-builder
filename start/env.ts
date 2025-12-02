/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from "@adonisjs/core/env";

export default await Env.create(new URL("../", import.meta.url), {
	NODE_ENV: Env.schema.enum(["development", "production", "test"] as const),
	PORT: Env.schema.number(),
	APP_KEY: Env.schema.string(),
	HOST: Env.schema.string({ format: "host" }),
	LOG_LEVEL: Env.schema.string(),

	/*
|----------------------------------------------------------
| Variables for configuring session package
|----------------------------------------------------------
*/
	SESSION_DRIVER: Env.schema.enum(["cookie", "memory"] as const),

	/*
|----------------------------------------------------------
| Variables for configuring database connection
|----------------------------------------------------------
*/
	DB_HOST: Env.schema.string({ format: "host" }),
	DB_PORT: Env.schema.number(),
	DB_USER: Env.schema.string(),
	DB_PASSWORD: Env.schema.string.optional(),
	DB_DATABASE: Env.schema.string(),
	DB_SSL: Env.schema.boolean.optional(),

	REDIS_HOST: Env.schema.string({ format: "host" }),
	REDIS_PORT: Env.schema.number(),
	REDIS_PASSWORD: Env.schema.string.optional(),

	/*
|----------------------------------------------------------
| Variables for configuring PostHog analytics
|----------------------------------------------------------
*/
	POSTHOG_API_KEY: Env.schema.string.optional(),
	POSTHOG_PROJECT_ID: Env.schema.string.optional(),
	POSTHOG_HOST: Env.schema.string.optional(),

	/*
|----------------------------------------------------------
| Variables for configuring payment providers
|----------------------------------------------------------
*/
	PAYMENT_PROVIDER: Env.schema.enum.optional([
		"lemonsqueezy",
		"stripe",
	] as const),

	// Lemon Squeezy configuration
	LEMONSQUEEZY_API_KEY: Env.schema.string.optional(),
	LEMONSQUEEZY_STORE_ID: Env.schema.string.optional(),
	LEMONSQUEEZY_WEBHOOK_SECRET: Env.schema.string.optional(),

	// Stripe configuration
	STRIPE_SECRET_KEY: Env.schema.string.optional(),
	STRIPE_PUBLISHABLE_KEY: Env.schema.string.optional(),
	STRIPE_WEBHOOK_SECRET: Env.schema.string.optional(),

	/*
|----------------------------------------------------------
| Variables for configuring email providers
|----------------------------------------------------------
*/
	EMAIL_PROVIDER: Env.schema.enum.optional(["resend", "smtp"] as const),
	EMAIL_FROM: Env.schema.string.optional(),

	// Resend configuration (primary)
	RESEND_API_KEY: Env.schema.string.optional(),

	// SMTP configuration (alternative)
	SMTP_HOST: Env.schema.string.optional(),
	SMTP_PORT: Env.schema.number.optional(),
	SMTP_SECURE: Env.schema.boolean.optional(),
	SMTP_USER: Env.schema.string.optional(),
	SMTP_PASS: Env.schema.string.optional(),

	/*
|----------------------------------------------------------
| Variables for MCP (Model Context Protocol)
|----------------------------------------------------------
*/
	APP_URL: Env.schema.string.optional(),

	/*
|----------------------------------------------------------
| Variables for NPM Registry
|----------------------------------------------------------
*/
	NPM_TOKEN: Env.schema.string.optional(),

	/*
|----------------------------------------------------------
| Variables for AI Assistant (Anthropic)
|----------------------------------------------------------
*/
	ANTHROPIC_API_KEY: Env.schema.string.optional(),
});
