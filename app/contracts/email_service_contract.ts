/**
 * Email Service Contract
 * Defines the interface for email operations.
 * Supports multiple providers (Resend, SMTP/Nodemailer).
 */

/**
 * Email provider types
 */
export type EmailProvider = "resend" | "smtp";

/**
 * Email address with optional name
 */
export interface EmailAddress {
	email: string;
	name?: string;
}

/**
 * Email attachment
 */
export interface EmailAttachment {
	filename: string;
	content: string | Buffer;
	contentType?: string;
}

/**
 * Email sending options
 */
export interface SendEmailOptions {
	to: string | string[] | EmailAddress | EmailAddress[];
	subject: string;
	html?: string;
	text?: string;
	from?: string | EmailAddress;
	replyTo?: string | EmailAddress;
	cc?: string | string[] | EmailAddress | EmailAddress[];
	bcc?: string | string[] | EmailAddress | EmailAddress[];
	attachments?: EmailAttachment[];
	tags?: Record<string, string>;
	headers?: Record<string, string>;
}

/**
 * Email template data
 */
export interface EmailTemplateData {
	[key: string]: unknown;
}

/**
 * Send email with template options
 */
export interface SendTemplateOptions {
	to: string | string[] | EmailAddress | EmailAddress[];
	template: EmailTemplate;
	data: EmailTemplateData;
	from?: string | EmailAddress;
	replyTo?: string | EmailAddress;
	cc?: string | string[] | EmailAddress | EmailAddress[];
	bcc?: string | string[] | EmailAddress | EmailAddress[];
	attachments?: EmailAttachment[];
	tags?: Record<string, string>;
}

/**
 * Email send result
 */
export interface EmailResult {
	id: string;
	provider: EmailProvider;
	success: boolean;
	error?: string;
}

/**
 * Batch email result
 */
export interface BatchEmailResult {
	results: EmailResult[];
	successCount: number;
	failureCount: number;
}

/**
 * Available email templates
 */
export type EmailTemplate =
	| "welcome"
	| "password-reset"
	| "password-changed"
	| "email-verification"
	| "subscription-created"
	| "subscription-cancelled"
	| "subscription-renewed"
	| "payment-failed"
	| "payment-success"
	| "proposal-shared"
	| "proposal-viewed"
	| "team-invitation";

/**
 * Template configuration
 */
export interface TemplateConfig {
	subject: string;
	preheader?: string;
}

/**
 * Email Service Contract
 * Abstract class defining the interface for email operations.
 */
export abstract class EmailServiceContract {
	/**
	 * Get the current email provider
	 */
	abstract getProvider(): EmailProvider;

	/**
	 * Send a raw email
	 */
	abstract send(options: SendEmailOptions): Promise<EmailResult>;

	/**
	 * Send email using a template
	 */
	abstract sendTemplate(options: SendTemplateOptions): Promise<EmailResult>;

	/**
	 * Send batch emails
	 */
	abstract sendBatch(emails: SendEmailOptions[]): Promise<BatchEmailResult>;

	/**
	 * Send batch template emails
	 */
	abstract sendBatchTemplate(
		emails: SendTemplateOptions[]
	): Promise<BatchEmailResult>;

	/**
	 * Verify email configuration
	 */
	abstract verify(): Promise<boolean>;

	/**
	 * Get template configuration
	 */
	abstract getTemplateConfig(template: EmailTemplate): TemplateConfig;

	/**
	 * Render template to HTML
	 */
	abstract renderTemplate(
		template: EmailTemplate,
		data: EmailTemplateData
	): Promise<{ html: string; text: string }>;
}
