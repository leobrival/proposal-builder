import type { ApplicationService } from "@adonisjs/core/types";
import { ProposalServiceContract } from "#contracts/proposal_service_contract";
import { UserServiceContract } from "#contracts/user_service_contract";

/**
 * App Services Provider
 * Registers application services in the IoC container for dependency injection.
 * This enables swapping implementations for testing and follows hexagonal architecture.
 */
export default class AppServicesProvider {
	constructor(protected app: ApplicationService) {}

	/**
	 * Register bindings to the container
	 */
	async register() {
		// Bind ProposalServiceContract to the concrete implementation
		this.app.container.singleton(ProposalServiceContract, async () => {
			const { default: ProposalService } = await import(
				"#services/proposal_service"
			);
			return ProposalService;
		});

		// Bind UserServiceContract to the concrete implementation
		this.app.container.singleton(UserServiceContract, async () => {
			const { default: UserService } = await import("#services/user_service");
			return UserService;
		});
	}

	/**
	 * The container bindings have been registered
	 */
	async boot() {}

	/**
	 * The application has been booted
	 */
	async start() {}

	/**
	 * The process has been started
	 */
	async ready() {}

	/**
	 * Preparing to shutdown the app
	 */
	async shutdown() {}
}
