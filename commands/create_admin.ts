import { args, BaseCommand, flags } from "@adonisjs/core/ace";
import type { CommandOptions } from "@adonisjs/core/types/ace";
import User from "#models/user";

export default class CreateAdmin extends BaseCommand {
	static commandName = "create:admin";
	static description = "Create an admin user";

	static options: CommandOptions = {
		startApp: true,
	};

	@args.string({ description: "Admin email address" })
	declare email: string;

	@flags.string({ description: "Admin password", alias: "p" })
	declare password: string;

	@flags.string({ description: "Admin first name", alias: "f" })
	declare firstName: string;

	@flags.string({ description: "Admin last name", alias: "l" })
	declare lastName: string;

	async run() {
		const email = this.email;
		const password = this.password || "admin123";
		const firstName = this.firstName || "Admin";
		const lastName = this.lastName || "User";

		// Check if user already exists
		const existingUser = await User.findBy("email", email);

		if (existingUser) {
			// Update to admin
			existingUser.role = "admin";
			await existingUser.save();
			this.logger.success(`User ${email} has been upgraded to admin`);
			return;
		}

		// Create new admin user (password is auto-hashed by AuthFinder)
		const user = await User.create({
			email,
			password,
			firstName,
			lastName,
			role: "admin",
			isActive: true,
		});

		this.logger.success(`Admin user created successfully`);
		this.logger.info(`Email: ${user.email}`);
		this.logger.info(`Password: ${password}`);
	}
}
