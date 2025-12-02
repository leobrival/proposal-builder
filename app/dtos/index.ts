/**
 * DTOs barrel export
 * Data Transfer Objects for API responses and frontend consumption
 */

// Auth DTOs
export {
	type AuthUserDto,
	type LoginResponseDto,
	type RegisterResponseDto,
	toAuthUserDto,
} from "./auth/index.js";
// Proposal DTOs
export {
	type BenefitDto,
	type ProposalDetailDto,
	type ProposalListItemDto,
	type PublicProposalDto,
	type TierDto,
	toBenefitDto,
	toProposalDetailDto,
	toProposalListDto,
	toProposalListItemDto,
	toPublicProposalDto,
	toTierDto,
} from "./proposal/index.js";
// User DTOs
export {
	toUserListDto,
	toUserListItemDto,
	toUserProfileDto,
	toUserReferenceDto,
	type UserListItemDto,
	type UserProfileDto,
	type UserReferenceDto,
} from "./user/index.js";
