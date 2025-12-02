import type User from "#models/user";

/**
 * Data for updating user profile
 */
export interface UpdateProfileData {
	firstName: string;
	lastName: string;
	email: string;
}

/**
 * Data for updating user password
 */
export interface UpdatePasswordData {
	currentPassword: string;
	newPassword: string;
}

/**
 * Contract for User Service
 * Defines the interface for user management operations.
 * Enables dependency injection and easy mocking in tests.
 */
export abstract class UserServiceContract {
	/**
	 * Find a user by ID
	 */
	abstract findById(id: string): Promise<User | null>;

	/**
	 * Find a user by ID or throw
	 * @throws UserNotFoundException if user not found
	 */
	abstract findByIdOrFail(id: string): Promise<User>;

	/**
	 * Find a user by email
	 */
	abstract findByEmail(email: string): Promise<User | null>;

	/**
	 * Update user profile
	 */
	abstract updateProfile(user: User, data: UpdateProfileData): Promise<User>;

	/**
	 * Update user password
	 */
	abstract updatePassword(user: User, data: UpdatePasswordData): Promise<void>;

	/**
	 * Verify if a password matches the user's password
	 */
	abstract verifyPassword(user: User, password: string): Promise<boolean>;

	/**
	 * Delete user account
	 */
	abstract deleteAccount(user: User, password: string): Promise<void>;
}
