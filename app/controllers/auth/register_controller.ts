import type { HttpContext } from "@adonisjs/core/http";
import User from "#models/user";
import { registerValidator } from "#validators/auth_validator";

export default class RegisterController {
	async show({ inertia }: HttpContext) {
		return inertia.render("auth/register");
	}

	async store({ request, auth, response }: HttpContext) {
		const data = await request.validateUsing(registerValidator);

		const user = await User.create({
			fullName: data.fullName,
			email: data.email,
			password: data.password,
		});

		await auth.use("web").login(user);

		return response.redirect().toRoute("dashboard");
	}
}
