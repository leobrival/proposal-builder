import { args, BaseCommand } from "@adonisjs/core/ace";
import type { CommandOptions } from "@adonisjs/core/types/ace";
import User from "#models/user";

export default class ResetPassword extends BaseCommand {
	static commandName = "reset:password";
	static description = "Reset password for a user";

	static options: CommandOptions = {
		startApp: true,
	};

	@args.string({ description: "User email" })
	declare email: string;

	@args.string({ description: "New password" })
	declare password: string;

	async run() {
		const user = await User.findBy("email", this.email);

		if (!user) {
			this.logger.error(`User with email ${this.email} not found`);
			return;
		}

		// Set plain password - the AuthFinder mixin will hash it automatically on save
		user.password = this.password;
		await user.save();

		this.logger.success(`Password reset for ${this.email}`);
	}
}
