import env from "#start/env";
import {
	EmailServiceContract,
	type EmailProvider,
	type SendEmailOptions,
	type SendTemplateOptions,
	type EmailResult,
	type BatchEmailResult,
	type EmailTemplate,
	type EmailTemplateData,
	type TemplateConfig,
} from "#contracts/email_service_contract";
import {
	type EmailStrategy,
	ResendStrategy,
	SMTPStrategy,
} from "#strategies/email/index";

/**
 * Template configurations
 */
const TEMPLATE_CONFIGS: Record<EmailTemplate, TemplateConfig> = {
	welcome: {
		subject: "Bienvenue sur Spons Easy !",
		preheader: "Commencez à créer des propositions de sponsoring professionnelles",
	},
	"password-reset": {
		subject: "Réinitialisez votre mot de passe",
		preheader: "Cliquez sur le lien pour réinitialiser votre mot de passe",
	},
	"password-changed": {
		subject: "Votre mot de passe a été modifié",
		preheader: "Confirmation de changement de mot de passe",
	},
	"email-verification": {
		subject: "Vérifiez votre adresse email",
		preheader: "Confirmez votre adresse email pour activer votre compte",
	},
	"subscription-created": {
		subject: "Bienvenue dans Spons Easy Pro !",
		preheader: "Votre abonnement a été activé avec succès",
	},
	"subscription-cancelled": {
		subject: "Confirmation d'annulation d'abonnement",
		preheader: "Votre abonnement a été annulé",
	},
	"subscription-renewed": {
		subject: "Votre abonnement a été renouvelé",
		preheader: "Merci pour votre confiance continue",
	},
	"payment-failed": {
		subject: "Échec du paiement - Action requise",
		preheader: "Nous n'avons pas pu traiter votre paiement",
	},
	"payment-success": {
		subject: "Confirmation de paiement",
		preheader: "Votre paiement a été traité avec succès",
	},
	"proposal-shared": {
		subject: "Une proposition vous a été partagée",
		preheader: "Consultez la proposition de sponsoring",
	},
	"proposal-viewed": {
		subject: "Votre proposition a été consultée",
		preheader: "Quelqu'un a consulté votre proposition",
	},
	"team-invitation": {
		subject: "Invitation à rejoindre une équipe",
		preheader: "Vous avez été invité à rejoindre une équipe sur Spons Easy",
	},
};

/**
 * Email Service
 * Orchestrates email operations using the configured email provider.
 * Supports switching between Resend and SMTP.
 */
class EmailService extends EmailServiceContract {
	private strategy: EmailStrategy | null = null;
	private initialized = false;

	/**
	 * Get and initialize the email strategy
	 */
	private async getStrategy(): Promise<EmailStrategy> {
		if (this.strategy && this.initialized) {
			return this.strategy;
		}

		const provider = env.get("EMAIL_PROVIDER", "resend") as EmailProvider;

		switch (provider) {
			case "smtp":
				this.strategy = new SMTPStrategy();
				break;
			case "resend":
			default:
				this.strategy = new ResendStrategy();
				break;
		}

		await this.strategy.initialize();
		this.initialized = true;

		return this.strategy;
	}

	getProvider(): EmailProvider {
		return env.get("EMAIL_PROVIDER", "resend") as EmailProvider;
	}

	async send(options: SendEmailOptions): Promise<EmailResult> {
		const strategy = await this.getStrategy();
		return strategy.send(options);
	}

	async sendTemplate(options: SendTemplateOptions): Promise<EmailResult> {
		const { template, data, ...emailOptions } = options;
		const { html, text } = await this.renderTemplate(template, data);
		const config = this.getTemplateConfig(template);

		return this.send({
			...emailOptions,
			subject: this.interpolateSubject(config.subject, data),
			html,
			text,
		});
	}

	async sendBatch(emails: SendEmailOptions[]): Promise<BatchEmailResult> {
		const strategy = await this.getStrategy();
		return strategy.sendBatch(emails);
	}

	async sendBatchTemplate(
		emails: SendTemplateOptions[]
	): Promise<BatchEmailResult> {
		const preparedEmails: SendEmailOptions[] = await Promise.all(
			emails.map(async ({ template, data, ...emailOptions }) => {
				const { html, text } = await this.renderTemplate(template, data);
				const config = this.getTemplateConfig(template);

				return {
					...emailOptions,
					subject: this.interpolateSubject(config.subject, data),
					html,
					text,
				};
			})
		);

		return this.sendBatch(preparedEmails);
	}

	async verify(): Promise<boolean> {
		const strategy = await this.getStrategy();
		return strategy.verify();
	}

	getTemplateConfig(template: EmailTemplate): TemplateConfig {
		return TEMPLATE_CONFIGS[template];
	}

	async renderTemplate(
		template: EmailTemplate,
		data: EmailTemplateData
	): Promise<{ html: string; text: string }> {
		const config = this.getTemplateConfig(template);
		const appName = "Spons Easy";
		const appUrl = env.get("APP_URL", "http://localhost:3333");
		const year = new Date().getFullYear();

		// Merge common data
		const templateData = {
			appName,
			appUrl,
			year,
			preheader: config.preheader || "",
			...data,
		};

		// Get template content
		const html = this.getHtmlTemplate(template, templateData);
		const text = this.getTextTemplate(template, templateData);

		return { html, text };
	}

	private interpolateSubject(
		subject: string,
		data: EmailTemplateData
	): string {
		return subject.replace(/\{\{(\w+)\}\}/g, (_, key) =>
			String(data[key] || "")
		);
	}

	private getHtmlTemplate(
		template: EmailTemplate,
		data: EmailTemplateData
	): string {
		const baseStyles = `
			body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
			.container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
			.card { background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
			.header { text-align: center; margin-bottom: 30px; }
			.logo { font-size: 24px; font-weight: bold; color: #3B82F6; }
			.content { margin-bottom: 30px; }
			.button { display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 500; }
			.button:hover { background-color: #2563EB; }
			.footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; color: #666; font-size: 14px; }
			.preheader { display: none !important; visibility: hidden; mso-hide: all; font-size: 1px; color: #f5f5f5; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; }
		`;

		const preheader = data.preheader
			? `<span class="preheader">${data.preheader}</span>`
			: "";

		const footer = `
			<div class="footer">
				<p>&copy; ${data.year} ${data.appName}. Tous droits réservés.</p>
				<p><a href="${data.appUrl}" style="color: #3B82F6;">Visiter ${data.appName}</a></p>
			</div>
		`;

		const content = this.getTemplateContent(template, data);

		return `
			<!DOCTYPE html>
			<html lang="fr">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>${this.getTemplateConfig(template).subject}</title>
				<style>${baseStyles}</style>
			</head>
			<body>
				${preheader}
				<div class="container">
					<div class="card">
						<div class="header">
							<div class="logo">${data.appName}</div>
						</div>
						<div class="content">
							${content}
						</div>
						${footer}
					</div>
				</div>
			</body>
			</html>
		`;
	}

	private getTemplateContent(
		template: EmailTemplate,
		data: EmailTemplateData
	): string {
		switch (template) {
			case "welcome":
				return `
					<h1>Bienvenue, ${data.userName || ""}!</h1>
					<p>Merci de vous être inscrit sur ${data.appName}.</p>
					<p>Avec ${data.appName}, vous pouvez créer des propositions de sponsoring professionnelles en quelques minutes.</p>
					<p style="text-align: center; margin: 30px 0;">
						<a href="${data.appUrl}/dashboard" class="button">Accéder à mon tableau de bord</a>
					</p>
					<p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
				`;

			case "password-reset":
				return `
					<h1>Réinitialisation de mot de passe</h1>
					<p>Vous avez demandé à réinitialiser votre mot de passe.</p>
					<p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
					<p style="text-align: center; margin: 30px 0;">
						<a href="${data.resetUrl}" class="button">Réinitialiser mon mot de passe</a>
					</p>
					<p>Ce lien expirera dans ${data.expiresIn || "1 heure"}.</p>
					<p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
				`;

			case "password-changed":
				return `
					<h1>Mot de passe modifié</h1>
					<p>Votre mot de passe a été modifié avec succès.</p>
					<p>Si vous n'êtes pas à l'origine de ce changement, veuillez nous contacter immédiatement.</p>
					<p style="text-align: center; margin: 30px 0;">
						<a href="${data.appUrl}/login" class="button">Se connecter</a>
					</p>
				`;

			case "email-verification":
				return `
					<h1>Vérifiez votre email</h1>
					<p>Merci de vous être inscrit ! Veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
					<p style="text-align: center; margin: 30px 0;">
						<a href="${data.verificationUrl}" class="button">Vérifier mon email</a>
					</p>
					<p>Ce lien expirera dans ${data.expiresIn || "24 heures"}.</p>
				`;

			case "subscription-created":
				return `
					<h1>Bienvenue dans ${data.appName} Pro !</h1>
					<p>Votre abonnement <strong>${data.planName || "Pro"}</strong> a été activé avec succès.</p>
					<p>Vous avez maintenant accès à toutes les fonctionnalités premium :</p>
					<ul>
						<li>Propositions illimitées</li>
						<li>Domaines personnalisés</li>
						<li>Analytics avancés</li>
						<li>Support prioritaire</li>
					</ul>
					<p style="text-align: center; margin: 30px 0;">
						<a href="${data.appUrl}/dashboard" class="button">Commencer</a>
					</p>
				`;

			case "subscription-cancelled":
				return `
					<h1>Abonnement annulé</h1>
					<p>Votre abonnement ${data.planName || ""} a été annulé.</p>
					<p>Vous continuerez à avoir accès aux fonctionnalités premium jusqu'au <strong>${data.endDate || ""}</strong>.</p>
					<p>Nous espérons vous revoir bientôt !</p>
					<p style="text-align: center; margin: 30px 0;">
						<a href="${data.appUrl}/billing" class="button">Réactiver mon abonnement</a>
					</p>
				`;

			case "subscription-renewed":
				return `
					<h1>Abonnement renouvelé</h1>
					<p>Votre abonnement <strong>${data.planName || "Pro"}</strong> a été renouvelé avec succès.</p>
					<p>Montant : <strong>${data.amount || ""}</strong></p>
					<p>Prochaine facturation : <strong>${data.nextBillingDate || ""}</strong></p>
					<p>Merci pour votre confiance continue !</p>
				`;

			case "payment-failed":
				return `
					<h1>Échec du paiement</h1>
					<p>Nous n'avons pas pu traiter votre paiement pour votre abonnement ${data.planName || ""}.</p>
					<p>Veuillez mettre à jour vos informations de paiement pour éviter une interruption de service.</p>
					<p style="text-align: center; margin: 30px 0;">
						<a href="${data.appUrl}/billing" class="button">Mettre à jour le paiement</a>
					</p>
					<p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
				`;

			case "payment-success":
				return `
					<h1>Paiement confirmé</h1>
					<p>Votre paiement de <strong>${data.amount || ""}</strong> a été traité avec succès.</p>
					<p>Détails :</p>
					<ul>
						<li>Plan : ${data.planName || ""}</li>
						<li>Montant : ${data.amount || ""}</li>
						<li>Date : ${data.paymentDate || ""}</li>
					</ul>
					<p>Merci de votre confiance !</p>
				`;

			case "proposal-shared":
				return `
					<h1>Nouvelle proposition partagée</h1>
					<p><strong>${data.senderName || "Quelqu'un"}</strong> a partagé une proposition avec vous :</p>
					<p><strong>${data.proposalTitle || "Proposition"}</strong></p>
					<p style="text-align: center; margin: 30px 0;">
						<a href="${data.proposalUrl}" class="button">Voir la proposition</a>
					</p>
				`;

			case "proposal-viewed":
				return `
					<h1>Votre proposition a été consultée</h1>
					<p>Bonne nouvelle ! Votre proposition <strong>"${data.proposalTitle || ""}"</strong> a été consultée.</p>
					<p>Détails :</p>
					<ul>
						<li>Date : ${data.viewedAt || ""}</li>
						${data.viewerLocation ? `<li>Localisation : ${data.viewerLocation}</li>` : ""}
					</ul>
					<p style="text-align: center; margin: 30px 0;">
						<a href="${data.appUrl}/proposals/${data.proposalId}" class="button">Voir les statistiques</a>
					</p>
				`;

			case "team-invitation":
				return `
					<h1>Invitation à rejoindre une équipe</h1>
					<p><strong>${data.inviterName || "Quelqu'un"}</strong> vous invite à rejoindre l'équipe <strong>${data.teamName || ""}</strong> sur ${data.appName}.</p>
					<p style="text-align: center; margin: 30px 0;">
						<a href="${data.invitationUrl}" class="button">Accepter l'invitation</a>
					</p>
					<p>Cette invitation expirera dans ${data.expiresIn || "7 jours"}.</p>
				`;

			default:
				return `<p>${data.message || ""}</p>`;
		}
	}

	private getTextTemplate(
		template: EmailTemplate,
		data: EmailTemplateData
	): string {
		switch (template) {
			case "welcome":
				return `
Bienvenue, ${data.userName || ""}!

Merci de vous être inscrit sur ${data.appName}.

Avec ${data.appName}, vous pouvez créer des propositions de sponsoring professionnelles en quelques minutes.

Accédez à votre tableau de bord : ${data.appUrl}/dashboard

Si vous avez des questions, n'hésitez pas à nous contacter.

---
© ${data.year} ${data.appName}. Tous droits réservés.
				`.trim();

			case "password-reset":
				return `
Réinitialisation de mot de passe

Vous avez demandé à réinitialiser votre mot de passe.

Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :
${data.resetUrl}

Ce lien expirera dans ${data.expiresIn || "1 heure"}.

Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.

---
© ${data.year} ${data.appName}. Tous droits réservés.
				`.trim();

			case "password-changed":
				return `
Mot de passe modifié

Votre mot de passe a été modifié avec succès.

Si vous n'êtes pas à l'origine de ce changement, veuillez nous contacter immédiatement.

Se connecter : ${data.appUrl}/login

---
© ${data.year} ${data.appName}. Tous droits réservés.
				`.trim();

			case "email-verification":
				return `
Vérifiez votre email

Merci de vous être inscrit ! Veuillez vérifier votre adresse email en cliquant sur le lien ci-dessous :
${data.verificationUrl}

Ce lien expirera dans ${data.expiresIn || "24 heures"}.

---
© ${data.year} ${data.appName}. Tous droits réservés.
				`.trim();

			case "subscription-created":
				return `
Bienvenue dans ${data.appName} Pro !

Votre abonnement ${data.planName || "Pro"} a été activé avec succès.

Vous avez maintenant accès à toutes les fonctionnalités premium :
- Propositions illimitées
- Domaines personnalisés
- Analytics avancés
- Support prioritaire

Commencer : ${data.appUrl}/dashboard

---
© ${data.year} ${data.appName}. Tous droits réservés.
				`.trim();

			case "subscription-cancelled":
				return `
Abonnement annulé

Votre abonnement ${data.planName || ""} a été annulé.

Vous continuerez à avoir accès aux fonctionnalités premium jusqu'au ${data.endDate || ""}.

Nous espérons vous revoir bientôt !

Réactiver : ${data.appUrl}/billing

---
© ${data.year} ${data.appName}. Tous droits réservés.
				`.trim();

			case "subscription-renewed":
				return `
Abonnement renouvelé

Votre abonnement ${data.planName || "Pro"} a été renouvelé avec succès.

Montant : ${data.amount || ""}
Prochaine facturation : ${data.nextBillingDate || ""}

Merci pour votre confiance continue !

---
© ${data.year} ${data.appName}. Tous droits réservés.
				`.trim();

			case "payment-failed":
				return `
Échec du paiement

Nous n'avons pas pu traiter votre paiement pour votre abonnement ${data.planName || ""}.

Veuillez mettre à jour vos informations de paiement pour éviter une interruption de service.

Mettre à jour : ${data.appUrl}/billing

Si vous avez des questions, n'hésitez pas à nous contacter.

---
© ${data.year} ${data.appName}. Tous droits réservés.
				`.trim();

			case "payment-success":
				return `
Paiement confirmé

Votre paiement de ${data.amount || ""} a été traité avec succès.

Détails :
- Plan : ${data.planName || ""}
- Montant : ${data.amount || ""}
- Date : ${data.paymentDate || ""}

Merci de votre confiance !

---
© ${data.year} ${data.appName}. Tous droits réservés.
				`.trim();

			case "proposal-shared":
				return `
Nouvelle proposition partagée

${data.senderName || "Quelqu'un"} a partagé une proposition avec vous :
${data.proposalTitle || "Proposition"}

Voir la proposition : ${data.proposalUrl}

---
© ${data.year} ${data.appName}. Tous droits réservés.
				`.trim();

			case "proposal-viewed":
				return `
Votre proposition a été consultée

Bonne nouvelle ! Votre proposition "${data.proposalTitle || ""}" a été consultée.

Date : ${data.viewedAt || ""}
${data.viewerLocation ? `Localisation : ${data.viewerLocation}` : ""}

Voir les statistiques : ${data.appUrl}/proposals/${data.proposalId}

---
© ${data.year} ${data.appName}. Tous droits réservés.
				`.trim();

			case "team-invitation":
				return `
Invitation à rejoindre une équipe

${data.inviterName || "Quelqu'un"} vous invite à rejoindre l'équipe ${data.teamName || ""} sur ${data.appName}.

Accepter l'invitation : ${data.invitationUrl}

Cette invitation expirera dans ${data.expiresIn || "7 jours"}.

---
© ${data.year} ${data.appName}. Tous droits réservés.
				`.trim();

			default:
				return String(data.message || "");
		}
	}
}

export default new EmailService();
