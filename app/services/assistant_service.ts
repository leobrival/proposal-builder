/**
 * Assistant Service
 * Internal AI assistant powered by Anthropic Claude.
 * Uses blog and documentation content as context.
 */

import Anthropic from "@anthropic-ai/sdk";
import type {
	BaseFrontmatter,
	DocsFrontmatter,
} from "#contracts/content_service_contract";
import contentService from "#services/content_service";
import env from "#start/env";

export interface Message {
	role: "user" | "assistant";
	content: string;
}

export interface AssistantResponse {
	message: string;
	sources?: {
		type: "blog" | "docs";
		slug: string;
		title: string;
	}[];
}

export interface ConversationContext {
	messages: Message[];
	userId?: string;
	sessionId: string;
}

/**
 * System prompt for the assistant
 * Based on: .ideabrowser/ai-assistant-knowledge.md
 */
const SYSTEM_PROMPT = `Tu es l'assistant IA de Spons Easy, une plateforme SaaS qui aide les createurs de contenu, associations et organisateurs d'evenements a creer des propositions de sponsoring professionnelles.

## IDENTITE

**Role**: Aider les utilisateurs a creer, publier et optimiser leurs propositions de sponsoring.
**Langue**: Toujours repondre en francais.
**Ton**: Amical, professionnel, concis et encourageant.

## REGLES

Tu dois:
- Repondre de maniere claire et directe
- Utiliser le contexte documentaire fourni
- Admettre quand tu ne sais pas
- Rediriger vers support@sponseasy.com pour: bugs, paiements, remboursements, securite

Tu ne dois PAS:
- Inventer des fonctionnalites
- Acceder aux donnees utilisateurs
- Executer des actions sur les comptes
- Promettre des resultats

## PRODUIT

**Spons Easy**: Propositions de sponsoring professionnelles en 5 minutes.
- URL: sponseasy.com/p/[nom-projet]
- Apercu temps reel pendant l'edition
- Formulaire de contact integre pour les sponsors

**Plans**:
| Gratuit | Pro (29 EUR/mois) |
|---------|-------------------|
| 1 proposition | Illimite |
| 10 leads/mois | Illimite |
| - | Export PDF |
| - | Branding personnalise |
| - | Analytiques |

## ONBOARDING (5 minutes)

1. Inscription (30s): Email + mot de passe + nom
2. Dashboard: Clic "Nouvelle proposition"
3. Creation (2min): Nom, description, paliers
4. Publication (30s): Un clic, lien instantane

**Paliers recommandes** (3 minimum):
- Bronze (500 EUR): Logo
- Argent (1 500 EUR): Logo + social
- Or (3 000 EUR): Logo + social + contenu dedie

## MOMENTS OF TRUTH (MOT)

Adapte ta reponse selon ou en est l'utilisateur:

**ZMOT (Recherche)**: Questions "comment ca marche", comparaisons
→ Rassurer, expliquer la valeur, inviter a essayer

**FMOT (Premier contact)**: Vient de s'inscrire, dashboard vide
→ Guider vers premiere action, simplifier

**IMOT (Creation)**: En train de creer une proposition
→ Repondre precisement, donner des exemples

**SMOT (Usage)**: A publie, attend des leads
→ Optimiser, suggerer ameliorations

**UMOT (Ambassadeur)**: Satisfait, a des resultats
→ Remercier, proposer referral

## PERSONAS

**Clara (Creatrice)**: 25-35 ans, veut monetiser son audience
→ Ton encourageant: "Votre proposition est plus pro que 90% des createurs"

**Alice (Association)**: 45-60 ans, club sportif/culturel
→ Ton rassurant: "D'autres associations comme la votre utilisent Spons Easy"

**Eric (Evenements)**: 30-45 ans, organise conferences/festivals
→ Ton efficace: "Gagnez 2 semaines par evenement"

## FAQ RAPIDES

**Creer une proposition**: Dashboard > Nouvelle proposition > Remplir > Publier
**Modifier apres publication**: Oui, modifications instantanees
**Lien ne marche pas**: Verifier statut "Publie"
**Pas de leads**: Partager activement le lien (email, LinkedIn, bio)
**Export PDF**: Fonctionnalite Pro uniquement
**2e proposition**: Limite gratuit, upgrader vers Pro

## EMAILS AUTOMATIQUES

- J+0: Bienvenue + quick start
- J+2: 3 conseils propositions
- J+4: Guide publication
- J+7: Gestion leads
- J+14: Check-in

## TEMPLATE EMAIL SPONSOR

"Bonjour [Prenom], je suis [Nom] de [Projet]. J'ai prepare une proposition de partenariat: [Lien]. Seriez-vous disponible pour en discuter?"`;

class AssistantService {
	private client: Anthropic | null = null;

	constructor() {
		const apiKey = env.get("ANTHROPIC_API_KEY");
		if (apiKey) {
			this.client = new Anthropic({ apiKey });
		}
	}

	/**
	 * Check if the assistant is available
	 */
	isAvailable(): boolean {
		return this.client !== null;
	}

	/**
	 * Build context from documentation and blog
	 */
	private async buildContext(query: string): Promise<{
		context: string;
		sources: AssistantResponse["sources"];
	}> {
		const sources: AssistantResponse["sources"] = [];
		const contextParts: string[] = [];

		// Search in docs and blog
		const searchResults = await contentService.search(query, ["docs", "blog"]);
		const relevantContent = searchResults.slice(0, 5);

		for (const result of relevantContent) {
			const frontmatter = result.frontmatter as BaseFrontmatter;
			const isDoc = "section" in frontmatter;
			const type = isDoc ? "docs" : "blog";

			sources.push({
				type: type as "blog" | "docs",
				slug: frontmatter.slug,
				title: frontmatter.title,
			});

			// Add content to context (limit to 1500 chars per doc)
			const contentPreview = result.content.substring(0, 1500);
			contextParts.push(
				`--- ${frontmatter.title} (${type}) ---\n${contentPreview}\n`,
			);
		}

		// Also get featured docs
		const { items: docs } = await contentService.list<DocsFrontmatter>({
			type: "docs",
			status: "published",
			limit: 10,
		});

		// Add doc titles as quick reference
		if (docs.length > 0) {
			const docList = docs
				.map(
					(d) => `- ${d.frontmatter.title}: ${d.frontmatter.description || ""}`,
				)
				.join("\n");
			contextParts.push(`\n--- Documentation disponible ---\n${docList}`);
		}

		return {
			context: contextParts.join("\n\n"),
			sources: sources.length > 0 ? sources : undefined,
		};
	}

	/**
	 * Chat with the assistant
	 */
	async chat(
		context: ConversationContext,
		userMessage: string,
	): Promise<AssistantResponse> {
		if (!this.client) {
			return {
				message:
					"L'assistant IA n'est pas configure. Veuillez contacter l'administrateur.",
			};
		}

		// Build context from docs
		const { context: docContext, sources } =
			await this.buildContext(userMessage);

		// Prepare messages for API
		const messages: Anthropic.MessageParam[] = [
			...context.messages.map((m) => ({
				role: m.role as "user" | "assistant",
				content: m.content,
			})),
			{
				role: "user" as const,
				content: userMessage,
			},
		];

		// Build system prompt with context
		const systemPrompt = `${SYSTEM_PROMPT}

--- CONTEXTE DOCUMENTAIRE ---
${docContext || "Aucun contenu pertinent trouve dans la documentation."}
--- FIN DU CONTEXTE ---`;

		try {
			const response = await this.client.messages.create({
				model: "claude-sonnet-4-20250514",
				max_tokens: 1024,
				system: systemPrompt,
				messages,
			});

			const textContent = response.content.find((c) => c.type === "text");
			const assistantMessage =
				textContent?.text || "Je n'ai pas pu generer une reponse.";

			return {
				message: assistantMessage,
				sources,
			};
		} catch (error) {
			console.error("Assistant error:", error);
			return {
				message:
					"Une erreur s'est produite lors de la communication avec l'assistant. Veuillez reessayer.",
			};
		}
	}

	/**
	 * Get suggested questions based on context
	 */
	async getSuggestions(): Promise<string[]> {
		return [
			"Comment creer ma premiere proposition de sponsoring ?",
			"Comment configurer l'integration MCP avec Claude Desktop ?",
			"Quels elements inclure dans une proposition reussie ?",
			"Comment personnaliser le design de ma page ?",
			"Comment partager ma proposition avec des sponsors potentiels ?",
		];
	}

	/**
	 * Search documentation for the assistant
	 */
	async searchDocs(query: string): Promise<
		{
			title: string;
			slug: string;
			excerpt: string;
			type: "blog" | "docs";
		}[]
	> {
		const results = await contentService.search(query, ["docs", "blog"]);

		return results.slice(0, 10).map((r) => {
			const frontmatter = r.frontmatter as BaseFrontmatter;
			const isDoc = "section" in frontmatter;

			return {
				title: frontmatter.title,
				slug: frontmatter.slug,
				excerpt: r.excerpt,
				type: isDoc ? "docs" : "blog",
			};
		});
	}
}

export default new AssistantService();
