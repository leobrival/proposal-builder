import BaseException from "./base_exception.js";

/**
 * Exception thrown when user is not found
 */
export class UserNotFoundException extends BaseException {
	constructor(userId?: string) {
		super("Utilisateur introuvable", {
			code: "E_USER_NOT_FOUND",
			status: 404,
			context: userId ? { userId } : undefined,
		});
	}
}

/**
 * Exception thrown when trying to modify own admin status
 */
export class CannotModifyOwnAdminStatusException extends BaseException {
	constructor() {
		super("Vous ne pouvez pas modifier votre propre statut administrateur", {
			code: "E_CANNOT_MODIFY_OWN_ADMIN_STATUS",
			status: 403,
		});
	}
}

/**
 * Exception thrown when trying to block own account
 */
export class CannotBlockOwnAccountException extends BaseException {
	constructor() {
		super("Vous ne pouvez pas bloquer votre propre compte", {
			code: "E_CANNOT_BLOCK_OWN_ACCOUNT",
			status: 403,
		});
	}
}

/**
 * Exception thrown when trying to delete own account as admin
 */
export class CannotDeleteOwnAccountException extends BaseException {
	constructor() {
		super("Vous ne pouvez pas supprimer votre propre compte", {
			code: "E_CANNOT_DELETE_OWN_ACCOUNT",
			status: 403,
		});
	}
}

/**
 * Exception thrown when plan value is invalid
 */
export class InvalidPlanException extends BaseException {
	constructor(plan: string) {
		super("Valeur de plan invalide", {
			code: "E_INVALID_PLAN",
			status: 400,
			context: { plan, validPlans: ["free", "paid"] },
		});
	}
}
