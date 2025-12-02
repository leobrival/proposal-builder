import type {
	LucidModel,
	ModelQueryBuilderContract,
} from "@adonisjs/lucid/types/model";
import type User from "#models/user";
import { BaseSpecification } from "./base_specification.js";

/**
 * Specification for filtering active users
 */
export class ActiveUserSpec extends BaseSpecification<User> {
	isSatisfiedBy(user: User): boolean {
		return user.isActive === true;
	}

	toQuery<M extends LucidModel>(
		query: ModelQueryBuilderContract<M, InstanceType<M>>,
	): ModelQueryBuilderContract<M, InstanceType<M>> {
		return query.where("is_active", true);
	}
}

/**
 * Specification for filtering blocked users
 */
export class BlockedUserSpec extends BaseSpecification<User> {
	isSatisfiedBy(user: User): boolean {
		return user.isActive === false;
	}

	toQuery<M extends LucidModel>(
		query: ModelQueryBuilderContract<M, InstanceType<M>>,
	): ModelQueryBuilderContract<M, InstanceType<M>> {
		return query.where("is_active", false);
	}
}

/**
 * Specification for filtering admin users
 */
export class AdminUserSpec extends BaseSpecification<User> {
	isSatisfiedBy(user: User): boolean {
		return user.isAdmin === true;
	}

	toQuery<M extends LucidModel>(
		query: ModelQueryBuilderContract<M, InstanceType<M>>,
	): ModelQueryBuilderContract<M, InstanceType<M>> {
		return query.where("is_admin", true);
	}
}

/**
 * Specification for filtering users by plan
 */
export class UserPlanSpec extends BaseSpecification<User> {
	constructor(private plan: "free" | "pro" | "enterprise") {
		super();
	}

	isSatisfiedBy(user: User): boolean {
		return user.plan === this.plan;
	}

	toQuery<M extends LucidModel>(
		query: ModelQueryBuilderContract<M, InstanceType<M>>,
	): ModelQueryBuilderContract<M, InstanceType<M>> {
		return query.where("plan", this.plan);
	}
}

/**
 * Specification for filtering users with last login
 */
export class HasLoggedInSpec extends BaseSpecification<User> {
	isSatisfiedBy(user: User): boolean {
		return user.lastLoginAt !== null;
	}

	toQuery<M extends LucidModel>(
		query: ModelQueryBuilderContract<M, InstanceType<M>>,
	): ModelQueryBuilderContract<M, InstanceType<M>> {
		return query.whereNotNull("last_login_at");
	}
}

/**
 * Specification for filtering users registered after a date
 */
export class RegisteredAfterSpec extends BaseSpecification<User> {
	constructor(private date: Date) {
		super();
	}

	isSatisfiedBy(user: User): boolean {
		return user.createdAt.toJSDate() >= this.date;
	}

	toQuery<M extends LucidModel>(
		query: ModelQueryBuilderContract<M, InstanceType<M>>,
	): ModelQueryBuilderContract<M, InstanceType<M>> {
		return query.where("created_at", ">=", this.date);
	}
}

/**
 * Specification for filtering paid users
 */
export class PaidUserSpec extends BaseSpecification<User> {
	isSatisfiedBy(user: User): boolean {
		return user.plan === "paid";
	}

	toQuery<M extends LucidModel>(
		query: ModelQueryBuilderContract<M, InstanceType<M>>,
	): ModelQueryBuilderContract<M, InstanceType<M>> {
		return query.where("plan", "paid");
	}
}
