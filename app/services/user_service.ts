import hash from "@adonisjs/core/services/hash";
import {
	type UpdatePasswordData,
	type UpdateProfileData,
	UserServiceContract,
} from "#contracts/user_service_contract";
import {
	InvalidPasswordException,
	UserNotFoundException,
} from "#exceptions/index";
import User from "#models/user";

/**
 * Service responsible for user profile management.
 * Handles profile updates, password changes, and account deletion.
 * Implements UserServiceContract for dependency injection support.
 */
class UserService extends UserServiceContract {
	/**
	 * Find a user by their ID.
	 *
	 * @param id - User's unique identifier
	 * @returns The user if found, null otherwise
	 */
	async findById(id: string): Promise<User | null> {
		return User.find(id);
	}

	/**
	 * Find a user by their ID or throw an exception.
	 *
	 * @param id - User's unique identifier
	 * @returns The user
	 * @throws {UserNotFoundException} When user is not found
	 */
	async findByIdOrFail(id: string): Promise<User> {
		const user = await User.find(id);
		if (!user) {
			throw new UserNotFoundException(id);
		}
		return user;
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
	 * Update user profile information.
	 *
	 * @param user - User instance to update
	 * @param data - New profile data
	 * @returns Updated user instance
	 *
	 * @example
	 * ```typescript
	 * const updatedUser = await userService.updateProfile(user, {
	 *   firstName: 'Jane',
	 *   lastName: 'Doe',
	 *   email: 'jane@example.com'
	 * });
	 * ```
	 */
	async updateProfile(user: User, data: UpdateProfileData): Promise<User> {
		user.firstName = data.firstName;
		user.lastName = data.lastName;

		if (data.email !== user.email) {
			user.email = data.email;
		}

		await user.save();
		return user;
	}

	/**
	 * Update user password after verifying current password.
	 *
	 * @param user - User instance to update
	 * @param data - Current and new password
	 * @throws {InvalidPasswordException} When current password is incorrect
	 *
	 * @example
	 * ```typescript
	 * try {
	 *   await userService.updatePassword(user, {
	 *     currentPassword: 'oldPassword',
	 *     newPassword: 'newSecurePassword'
	 *   });
	 * } catch (error) {
	 *   if (error instanceof InvalidPasswordException) {
	 *     // Current password is incorrect
	 *   }
	 * }
	 * ```
	 */
	async updatePassword(user: User, data: UpdatePasswordData): Promise<void> {
		const isValidPassword = await hash.verify(
			user.password,
			data.currentPassword,
		);

		if (!isValidPassword) {
			throw new InvalidPasswordException();
		}

		user.password = data.newPassword;
		await user.save();
	}

	/**
	 * Verify if a password matches the user's password.
	 *
	 * @param user - User instance
	 * @param password - Password to verify
	 * @returns True if password matches
	 */
	async verifyPassword(user: User, password: string): Promise<boolean> {
		return hash.verify(user.password, password);
	}

	/**
	 * Delete user account after password verification.
	 *
	 * @param user - User instance to delete
	 * @param password - User's password for confirmation
	 * @throws {InvalidPasswordException} When password is incorrect
	 *
	 * @example
	 * ```typescript
	 * try {
	 *   await userService.deleteAccount(user, 'userPassword');
	 *   // Account deleted successfully
	 * } catch (error) {
	 *   if (error instanceof InvalidPasswordException) {
	 *     // Password verification failed
	 *   }
	 * }
	 * ```
	 */
	async deleteAccount(user: User, password: string): Promise<void> {
		const isValidPassword = await hash.verify(user.password, password);

		if (!isValidPassword) {
			throw new InvalidPasswordException();
		}

		await user.delete();
	}

	/**
	 * Get user profile data formatted for frontend consumption.
	 *
	 * @param user - User instance
	 * @returns Formatted profile data object
	 */
	getProfileData(user: User) {
		return {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			createdAt: user.createdAt.toISO(),
		};
	}
}

export default new UserService();
