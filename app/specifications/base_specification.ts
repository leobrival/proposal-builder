import type {
	LucidModel,
	ModelQueryBuilderContract,
} from "@adonisjs/lucid/types/model";

/**
 * Specification Pattern Interface
 * Encapsulates business rules for filtering and validation.
 * Can be applied both to in-memory objects and database queries.
 */
export interface Specification<T> {
	/**
	 * Check if an entity satisfies the specification (in-memory)
	 */
	isSatisfiedBy(entity: T): boolean;

	/**
	 * Apply the specification to a query builder (database)
	 */
	toQuery<M extends LucidModel>(
		query: ModelQueryBuilderContract<M, InstanceType<M>>,
	): ModelQueryBuilderContract<M, InstanceType<M>>;
}

/**
 * Abstract base class for specifications with composition support
 */
export abstract class BaseSpecification<T> implements Specification<T> {
	abstract isSatisfiedBy(entity: T): boolean;

	abstract toQuery<M extends LucidModel>(
		query: ModelQueryBuilderContract<M, InstanceType<M>>,
	): ModelQueryBuilderContract<M, InstanceType<M>>;

	/**
	 * Combine with another specification using AND logic
	 */
	and(other: Specification<T>): Specification<T> {
		return new AndSpecification(this, other);
	}

	/**
	 * Combine with another specification using OR logic
	 */
	or(other: Specification<T>): Specification<T> {
		return new OrSpecification(this, other);
	}

	/**
	 * Negate this specification
	 */
	not(): Specification<T> {
		return new NotSpecification(this);
	}
}

/**
 * AND Composite Specification
 */
class AndSpecification<T> extends BaseSpecification<T> {
	constructor(
		private left: Specification<T>,
		private right: Specification<T>,
	) {
		super();
	}

	isSatisfiedBy(entity: T): boolean {
		return this.left.isSatisfiedBy(entity) && this.right.isSatisfiedBy(entity);
	}

	toQuery<M extends LucidModel>(
		query: ModelQueryBuilderContract<M, InstanceType<M>>,
	): ModelQueryBuilderContract<M, InstanceType<M>> {
		return this.right.toQuery(this.left.toQuery(query));
	}
}

/**
 * OR Composite Specification
 */
class OrSpecification<T> extends BaseSpecification<T> {
	constructor(
		private left: Specification<T>,
		private right: Specification<T>,
	) {
		super();
	}

	isSatisfiedBy(entity: T): boolean {
		return this.left.isSatisfiedBy(entity) || this.right.isSatisfiedBy(entity);
	}

	toQuery<M extends LucidModel>(
		query: ModelQueryBuilderContract<M, InstanceType<M>>,
	): ModelQueryBuilderContract<M, InstanceType<M>> {
		return query
			.where((builder) => {
				this.left.toQuery(
					builder as unknown as ModelQueryBuilderContract<M, InstanceType<M>>,
				);
			})
			.orWhere((builder) => {
				this.right.toQuery(
					builder as unknown as ModelQueryBuilderContract<M, InstanceType<M>>,
				);
			}) as ModelQueryBuilderContract<M, InstanceType<M>>;
	}
}

/**
 * NOT Specification (negation)
 */
class NotSpecification<T> extends BaseSpecification<T> {
	constructor(private spec: Specification<T>) {
		super();
	}

	isSatisfiedBy(entity: T): boolean {
		return !this.spec.isSatisfiedBy(entity);
	}

	toQuery<M extends LucidModel>(
		query: ModelQueryBuilderContract<M, InstanceType<M>>,
	): ModelQueryBuilderContract<M, InstanceType<M>> {
		return query.whereNot((builder) => {
			this.spec.toQuery(
				builder as unknown as ModelQueryBuilderContract<M, InstanceType<M>>,
			);
		}) as ModelQueryBuilderContract<M, InstanceType<M>>;
	}
}

export { AndSpecification, OrSpecification, NotSpecification };
