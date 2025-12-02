import type { HttpContext } from "@adonisjs/core/http";
import type { McpScope } from "#contracts/mcp_service_contract";
import mcpService from "#services/mcp_service";
import planLimitsService from "#services/plan_limits_service";

/**
 * API Keys Controller
 * Handles CRUD operations for API keys.
 * MCP is accessible by ALL plans - no restrictions.
 */
export default class ApiKeysController {
	/**
	 * List all API keys for the authenticated user
	 * GET /api/keys
	 */
	async index({ auth, response }: HttpContext) {
		const user = auth.user!;

		const keys = await mcpService.listApiKeys(user);
		const limits = planLimitsService.getPlanLimits(user);
		const apiKeyCheck = await planLimitsService.canCreateApiKey(user);

		return response.json({
			keys,
			limits: {
				maxKeys: limits.maxApiKeys,
				currentCount: apiKeyCheck.current,
				remaining: apiKeyCheck.remaining,
			},
		});
	}

	/**
	 * Create a new API key
	 * POST /api/keys
	 */
	async store({ auth, request, response }: HttpContext) {
		const user = auth.user!;

		const { name, scopes, expiresAt } = request.only([
			"name",
			"scopes",
			"expiresAt",
		]);

		if (!name || typeof name !== "string" || name.length < 1) {
			return response.status(400).json({
				error: "Le nom est requis",
				code: "VALIDATION_ERROR",
			});
		}

		try {
			const apiKey = await mcpService.createApiKey(user, {
				name,
				scopes: scopes as McpScope[],
				expiresAt: expiresAt ? new Date(expiresAt) : null,
			});

			return response.status(201).json({
				key: apiKey,
				message:
					"Clé API créée avec succès. Sauvegardez la clé maintenant - elle ne sera plus affichée.",
			});
		} catch (error) {
			return response.status(400).json({
				error:
					error instanceof Error
						? error.message
						: "Échec de la création de la clé API",
				code: "CREATE_FAILED",
			});
		}
	}

	/**
	 * Get a specific API key
	 * GET /api/keys/:id
	 */
	async show({ auth, params, response }: HttpContext) {
		const user = auth.user!;
		const key = await mcpService.getApiKey(user, params.id);

		if (!key) {
			return response.status(404).json({
				error: "Clé API non trouvée",
				code: "NOT_FOUND",
			});
		}

		return response.json({ key });
	}

	/**
	 * Update an API key
	 * PUT /api/keys/:id
	 */
	async update({ auth, params, request, response }: HttpContext) {
		const user = auth.user!;
		const updates = request.only(["name", "scopes", "expiresAt", "isActive"]);

		// Parse expiresAt if provided
		if (updates.expiresAt) {
			updates.expiresAt = new Date(updates.expiresAt);
		}

		const key = await mcpService.updateApiKey(user, params.id, updates);

		if (!key) {
			return response.status(404).json({
				error: "Clé API non trouvée",
				code: "NOT_FOUND",
			});
		}

		return response.json({
			key,
			message: "Clé API mise à jour avec succès",
		});
	}

	/**
	 * Delete an API key
	 * DELETE /api/keys/:id
	 */
	async destroy({ auth, params, response }: HttpContext) {
		const user = auth.user!;
		const deleted = await mcpService.deleteApiKey(user, params.id);

		if (!deleted) {
			return response.status(404).json({
				error: "Clé API non trouvée",
				code: "NOT_FOUND",
			});
		}

		return response.json({
			message: "Clé API supprimée avec succès",
		});
	}

	/**
	 * Revoke all API keys
	 * POST /api/keys/revoke-all
	 */
	async revokeAll({ auth, response }: HttpContext) {
		const user = auth.user!;
		const count = await mcpService.revokeAllApiKeys(user);

		return response.json({
			message: `${count} clé(s) API révoquée(s)`,
			revokedCount: count,
		});
	}

	/**
	 * Get usage statistics
	 * GET /api/keys/usage
	 */
	async usage({ auth, response }: HttpContext) {
		const user = auth.user!;

		const stats = await mcpService.getUserUsageStats(user);
		const limits = await mcpService.getUserLimits(user);

		return response.json({
			stats,
			limits,
		});
	}

	/**
	 * Get usage statistics for a specific key
	 * GET /api/keys/:id/usage
	 */
	async keyUsage({ auth, params, response }: HttpContext) {
		const user = auth.user!;
		const key = await mcpService.getApiKey(user, params.id);

		if (!key) {
			return response.status(404).json({
				error: "Clé API non trouvée",
				code: "NOT_FOUND",
			});
		}

		// Get the actual ApiKey model for stats
		const { default: ApiKey } = await import("#models/api_key");
		const apiKey = await ApiKey.find(params.id);

		if (!apiKey) {
			return response.status(404).json({
				error: "Clé API non trouvée",
				code: "NOT_FOUND",
			});
		}

		const stats = await mcpService.getUsageStats(apiKey);

		return response.json({ stats });
	}
}
