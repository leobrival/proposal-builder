import type User from "#models/user";

/**
 * DTO for authenticated user session data
 */
export interface AuthUserDto {
	id: string;
	firstName: string;
	lastName: string;
	fullName: string;
	email: string;
	role: string;
	plan: string;
}

/**
 * DTO for login response
 */
export interface LoginResponseDto {
	user: AuthUserDto;
	redirectUrl: string;
}

/**
 * DTO for registration response
 */
export interface RegisterResponseDto {
	user: AuthUserDto;
	redirectUrl: string;
}

/**
 * Transform a User model to AuthUserDto
 */
export function toAuthUserDto(user: User): AuthUserDto {
	return {
		id: user.id,
		firstName: user.firstName,
		lastName: user.lastName,
		fullName: user.fullName,
		email: user.email,
		role: user.role,
		plan: user.plan,
	};
}
