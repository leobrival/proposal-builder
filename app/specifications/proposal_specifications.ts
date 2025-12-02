import type {
	LucidModel,
	ModelQueryBuilderContract,
} from "@adonisjs/lucid/types/model";
import type Proposal from "#models/proposal";
import type { ProposalStatus } from "#models/proposal";
import { BaseSpecification } from "./base_specification.js";

/**
 * Specification for filtering published proposals
 */
export class PublishedProposalSpec extends BaseSpecification<Proposal> {
	isSatisfiedBy(proposal: Proposal): boolean {
		return proposal.status === "published";
	}

	toQuery<M extends LucidModel>(
		query: ModelQueryBuilderContract<M, InstanceType<M>>,
	): ModelQueryBuilderContract<M, InstanceType<M>> {
		return query.where("status", "published");
	}
}

/**
 * Specification for filtering draft proposals
 */
export class DraftProposalSpec extends BaseSpecification<Proposal> {
	isSatisfiedBy(proposal: Proposal): boolean {
		return proposal.status === "draft";
	}

	toQuery<M extends LucidModel>(
		query: ModelQueryBuilderContract<M, InstanceType<M>>,
	): ModelQueryBuilderContract<M, InstanceType<M>> {
		return query.where("status", "draft");
	}
}

/**
 * Specification for filtering proposals by status
 */
export class ProposalStatusSpec extends BaseSpecification<Proposal> {
	constructor(private status: ProposalStatus) {
		super();
	}

	isSatisfiedBy(proposal: Proposal): boolean {
		return proposal.status === this.status;
	}

	toQuery<M extends LucidModel>(
		query: ModelQueryBuilderContract<M, InstanceType<M>>,
	): ModelQueryBuilderContract<M, InstanceType<M>> {
		return query.where("status", this.status);
	}
}

/**
 * Specification for filtering proposals by user
 */
export class UserProposalSpec extends BaseSpecification<Proposal> {
	constructor(private userId: string) {
		super();
	}

	isSatisfiedBy(proposal: Proposal): boolean {
		return proposal.userId === this.userId;
	}

	toQuery<M extends LucidModel>(
		query: ModelQueryBuilderContract<M, InstanceType<M>>,
	): ModelQueryBuilderContract<M, InstanceType<M>> {
		return query.where("user_id", this.userId);
	}
}

/**
 * Specification for filtering proposals with custom domain
 */
export class HasCustomDomainSpec extends BaseSpecification<Proposal> {
	isSatisfiedBy(proposal: Proposal): boolean {
		return proposal.customDomain !== null && proposal.customDomain !== "";
	}

	toQuery<M extends LucidModel>(
		query: ModelQueryBuilderContract<M, InstanceType<M>>,
	): ModelQueryBuilderContract<M, InstanceType<M>> {
		return query.whereNotNull("custom_domain").whereNot("custom_domain", "");
	}
}

/**
 * Specification for filtering proposals with verified domain
 */
export class VerifiedDomainSpec extends BaseSpecification<Proposal> {
	isSatisfiedBy(proposal: Proposal): boolean {
		return proposal.domainStatus === "verified";
	}

	toQuery<M extends LucidModel>(
		query: ModelQueryBuilderContract<M, InstanceType<M>>,
	): ModelQueryBuilderContract<M, InstanceType<M>> {
		return query.where("domain_status", "verified");
	}
}

/**
 * Specification for filtering proposals with minimum view count
 */
export class MinViewCountSpec extends BaseSpecification<Proposal> {
	constructor(private minViews: number) {
		super();
	}

	isSatisfiedBy(proposal: Proposal): boolean {
		return (proposal.viewCount ?? 0) >= this.minViews;
	}

	toQuery<M extends LucidModel>(
		query: ModelQueryBuilderContract<M, InstanceType<M>>,
	): ModelQueryBuilderContract<M, InstanceType<M>> {
		return query.where("view_count", ">=", this.minViews);
	}
}

/**
 * Specification for filtering proposals created after a date
 */
export class CreatedAfterSpec extends BaseSpecification<Proposal> {
	constructor(private date: Date) {
		super();
	}

	isSatisfiedBy(proposal: Proposal): boolean {
		return proposal.createdAt.toJSDate() >= this.date;
	}

	toQuery<M extends LucidModel>(
		query: ModelQueryBuilderContract<M, InstanceType<M>>,
	): ModelQueryBuilderContract<M, InstanceType<M>> {
		return query.where("created_at", ">=", this.date);
	}
}

/**
 * Specification for filtering proposals by event category
 */
export class EventCategorySpec extends BaseSpecification<Proposal> {
	constructor(private category: string) {
		super();
	}

	isSatisfiedBy(proposal: Proposal): boolean {
		return proposal.eventCategory === this.category;
	}

	toQuery<M extends LucidModel>(
		query: ModelQueryBuilderContract<M, InstanceType<M>>,
	): ModelQueryBuilderContract<M, InstanceType<M>> {
		return query.where("event_category", this.category);
	}
}

/**
 * Specification for filtering proposals by event format
 */
export class EventFormatSpec extends BaseSpecification<Proposal> {
	constructor(private format: "in_person" | "online" | "hybrid") {
		super();
	}

	isSatisfiedBy(proposal: Proposal): boolean {
		return proposal.eventFormat === this.format;
	}

	toQuery<M extends LucidModel>(
		query: ModelQueryBuilderContract<M, InstanceType<M>>,
	): ModelQueryBuilderContract<M, InstanceType<M>> {
		return query.where("event_format", this.format);
	}
}
