import type User from "#models/user";

/**
 * DTO for public user profile data
 * Used for API responses and frontend consumption
 */
export interface UserProfileDto {
	id: string;
	firstName: string;
	lastName: string;
	fullName: string;
	email: string;
	plan: string;
	role: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

/**
 * DTO for user list items (admin view)
 */
export interface UserListItemDto {
	id: string;
	fullName: string;
	email: string;
	plan: string;
	role: string;
	isActive: boolean;
	createdAt: string;
}

/**
 * DTO for minimal user reference
 */
export interface UserReferenceDto {
	id: string;
	fullName: string;
	email: string;
}

/**
 * Transform a User model to UserProfileDto
 */
export function toUserProfileDto(user: User): UserProfileDto {
	return {
		id: user.id,
		firstName: user.firstName,
		lastName: user.lastName,
		fullName: user.fullName,
		email: user.email,
		plan: user.plan,
		role: user.role,
		isActive: user.isActive,
		createdAt: user.createdAt.toISO() ?? "",
		updatedAt: user.updatedAt.toISO() ?? "",
	};
}

/**
 * Transform a User model to UserListItemDto
 */
export function toUserListItemDto(user: User): UserListItemDto {
	return {
		id: user.id,
		fullName: user.fullName,
		email: user.email,
		plan: user.plan,
		role: user.role,
		isActive: user.isActive,
		createdAt: user.createdAt.toISO() ?? "",
	};
}

/**
 * Transform a User model to UserReferenceDto
 */
export function toUserReferenceDto(user: User): UserReferenceDto {
	return {
		id: user.id,
		fullName: user.fullName,
		email: user.email,
	};
}

/**
 * Transform an array of Users to UserListItemDto array
 */
export function toUserListDto(users: User[]): UserListItemDto[] {
	return users.map(toUserListItemDto);
}
