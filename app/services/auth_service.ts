import { InvalidCredentialsException } from "#exceptions/index";
import User from "#models/user";

/**
 * Data required to register a new user
 */
export interface RegisterData {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

/**
 * Service responsible for authentication operations.
 * Handles user registration and credential verification.
 */
class AuthService {
	/**
	 * Register a new user in the system.
	 *
	 * @param data - Registration data including name, email and password
	 * @returns The newly created user
	 *
	 * @example
	 * ```typescript
	 * const user = await authService.register({
	 *   firstName: 'John',
	 *   lastName: 'Doe',
	 *   email: 'john@example.com',
	 *   password: 'securePassword123'
	 * });
	 * ```
	 */
	async register(data: RegisterData): Promise<User> {
		const user = await User.create({
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			password: data.password,
		});

		return user;
	}

	/**
	 * Verify user credentials for login.
	 *
	 * @param email - User's email address
	 * @param password - User's password
	 * @returns The authenticated user
	 * @throws {InvalidCredentialsException} When credentials are invalid
	 *
	 * @example
	 * ```typescript
	 * try {
	 *   const user = await authService.verifyCredentials('john@example.com', 'password');
	 *   // Login successful
	 * } catch (error) {
	 *   if (error instanceof InvalidCredentialsException) {
	 *     // Handle invalid credentials
	 *   }
	 * }
	 * ```
	 */
	async verifyCredentials(email: string, password: string): Promise<User> {
		try {
			const user = await User.verifyCredentials(email, password);
			return user;
		} catch {
			throw new InvalidCredentialsException();
		}
	}

	/**
	 * Find a user by their email address.
	 *
	 * @param email - Email address to search for
	 * @returns The user if found, null otherwise
	 */
	async findByEmail(email: string): Promise<User | null> {
		return User.findBy("email", email);
	}

	/**
	 * Check if an email address is already registered.
	 *
	 * @param email - Email address to check
	 * @returns True if email is already registered
	 */
	async isEmailRegistered(email: string): Promise<boolean> {
		const user = await this.findByEmail(email);
		return user !== null;
	}
}

export default new AuthService();
