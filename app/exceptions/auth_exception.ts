import BaseException from "./base_exception.js";

/**
 * Exception thrown when user credentials are invalid
 */
export class InvalidCredentialsException extends BaseException {
	constructor() {
		super("Email ou mot de passe incorrect", {
			code: "E_INVALID_CREDENTIALS",
			status: 401,
		});
	}
}

/**
 * Exception thrown when email is already registered
 */
export class EmailAlreadyRegisteredException extends BaseException {
	constructor(email: string) {
		super("Cet email est deja utilise", {
			code: "E_EMAIL_ALREADY_REGISTERED",
			status: 409,
			context: { email },
		});
	}
}

/**
 * Exception thrown when password verification fails
 */
export class InvalidPasswordException extends BaseException {
	constructor() {
		super("Mot de passe incorrect", {
			code: "E_INVALID_PASSWORD",
			status: 401,
		});
	}
}

/**
 * Exception thrown when user is not authenticated
 */
export class UnauthenticatedException extends BaseException {
	constructor() {
		super("Vous devez etre connecte pour acceder a cette ressource", {
			code: "E_UNAUTHENTICATED",
			status: 401,
		});
	}
}

/**
 * Exception thrown when user account is blocked
 */
export class AccountBlockedException extends BaseException {
	constructor() {
		super("Votre compte a ete bloque", {
			code: "E_ACCOUNT_BLOCKED",
			status: 403,
		});
	}
}
