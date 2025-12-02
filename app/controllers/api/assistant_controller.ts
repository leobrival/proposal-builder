import { randomUUID } from "node:crypto";
import type { HttpContext } from "@adonisjs/core/http";
import assistantService, {
	type ConversationContext,
	type Message,
} from "#services/assistant_service";

/**
 * Assistant Controller
 * Handles internal AI assistant chat endpoints.
 * Requires authenticated user.
 */
export default class AssistantController {
	/**
	 * Check assistant availability
	 * GET /api/assistant/status
	 */
	async status({ response }: HttpContext) {
		const isAvailable = assistantService.isAvailable();

		return response.json({
			available: isAvailable,
			message: isAvailable
				? "L'assistant est disponible"
				: "L'assistant n'est pas configure. Contactez l'administrateur.",
		});
	}

	/**
	 * Get suggested questions
	 * GET /api/assistant/suggestions
	 */
	async suggestions({ response }: HttpContext) {
		const suggestions = await assistantService.getSuggestions();

		return response.json({
			suggestions,
		});
	}

	/**
	 * Chat with the assistant
	 * POST /api/assistant/chat
	 */
	async chat({ request, response, auth }: HttpContext) {
		const user = auth.user;

		if (!assistantService.isAvailable()) {
			return response.status(503).json({
				error: "L'assistant n'est pas disponible actuellement",
				code: "ASSISTANT_UNAVAILABLE",
			});
		}

		const body = request.body();
		const message = body.message;
		const history = body.history || [];
		const sessionId = body.sessionId || randomUUID();

		if (!message || typeof message !== "string") {
			return response.status(400).json({
				error: "Le message est requis",
				code: "INVALID_MESSAGE",
			});
		}

		if (message.length > 2000) {
			return response.status(400).json({
				error: "Le message est trop long (max 2000 caracteres)",
				code: "MESSAGE_TOO_LONG",
			});
		}

		// Validate history format
		const validHistory: Message[] = [];
		if (Array.isArray(history)) {
			for (const item of history) {
				if (
					item &&
					typeof item === "object" &&
					(item.role === "user" || item.role === "assistant") &&
					typeof item.content === "string"
				) {
					validHistory.push({
						role: item.role,
						content: item.content,
					});
				}
			}
		}

		// Limit history to last 10 messages
		const limitedHistory = validHistory.slice(-10);

		const context: ConversationContext = {
			messages: limitedHistory,
			userId: user?.id,
			sessionId,
		};

		const result = await assistantService.chat(context, message);

		return response.json({
			message: result.message,
			sources: result.sources,
			sessionId,
		});
	}

	/**
	 * Search documentation
	 * GET /api/assistant/search
	 */
	async search({ request, response }: HttpContext) {
		const query = request.input("q");

		if (!query || typeof query !== "string") {
			return response.status(400).json({
				error: "Le parametre de recherche 'q' est requis",
				code: "INVALID_QUERY",
			});
		}

		const results = await assistantService.searchDocs(query);

		return response.json({
			results,
			query,
		});
	}
}
