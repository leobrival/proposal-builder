import type {
	EmailProvider,
	SendEmailOptions,
	EmailResult,
	BatchEmailResult,
} from "#contracts/email_service_contract";

/**
 * Email Strategy Interface
 * Defines the contract for email provider implementations.
 */
export interface EmailStrategy {
	/**
	 * The provider identifier
	 */
	readonly provider: EmailProvider;

	/**
	 * Initialize the email strategy
	 */
	initialize(): Promise<void>;

	/**
	 * Send a single email
	 */
	send(options: SendEmailOptions): Promise<EmailResult>;

	/**
	 * Send multiple emails in batch
	 */
	sendBatch(emails: SendEmailOptions[]): Promise<BatchEmailResult>;

	/**
	 * Verify the email configuration is valid
	 */
	verify(): Promise<boolean>;
}

export { ResendStrategy } from "./resend_strategy.js";
export { SMTPStrategy } from "./smtp_strategy.js";
