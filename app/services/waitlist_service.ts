import Waitlist from "#models/waitlist";

/**
 * Data structure for adding to waitlist
 */
export interface AddToWaitlistData {
	email: string;
	creatorType?: string | null;
	source?: string | null;
	referrer?: string | null;
}

/**
 * Result structure for waitlist operations
 */
export interface AddToWaitlistResult {
	success: boolean;
	alreadyRegistered: boolean;
	message: string;
}

/**
 * Service responsible for waitlist management
 * Handles email subscriptions for pre-launch signups
 */
class WaitlistService {
	/**
	 * Add an email to the waitlist
	 * @param data - Waitlist entry data
	 * @returns Result indicating success and registration status
	 */
	async addToWaitlist(data: AddToWaitlistData): Promise<AddToWaitlistResult> {
		const existing = await Waitlist.findBy("email", data.email);

		if (existing) {
			return {
				success: true,
				alreadyRegistered: true,
				message: "You are already on the waitlist!",
			};
		}

		await Waitlist.create({
			email: data.email,
			creatorType: data.creatorType || null,
			source: data.source || null,
			referrer: data.referrer || null,
		});

		return {
			success: true,
			alreadyRegistered: false,
			message: "Welcome to the waitlist!",
		};
	}

	/**
	 * Get total number of waitlist entries
	 * @returns Total count of waitlist entries
	 */
	async getCount(): Promise<number> {
		const result = await Waitlist.query().count("* as total");
		return Number(result[0].$extras.total) || 0;
	}

	/**
	 * Check if an email is already on the waitlist
	 * @param email - Email to check
	 * @returns True if email is on waitlist
	 */
	async isOnWaitlist(email: string): Promise<boolean> {
		const entry = await Waitlist.findBy("email", email);
		return entry !== null;
	}

	/**
	 * Get all waitlist entries ordered by signup date
	 * @returns Array of all waitlist entries
	 */
	async getAll(): Promise<Waitlist[]> {
		return Waitlist.query().orderBy("createdAt", "desc");
	}

	/**
	 * Remove an email from the waitlist
	 * @param email - Email to remove
	 * @returns True if entry was found and removed
	 */
	async remove(email: string): Promise<boolean> {
		const entry = await Waitlist.findBy("email", email);
		if (entry) {
			await entry.delete();
			return true;
		}
		return false;
	}
}

export default new WaitlistService();
