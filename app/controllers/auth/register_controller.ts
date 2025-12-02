import type { HttpContext } from "@adonisjs/core/http";
import authService from "#services/auth_service";
import { registerValidator } from "#validators/auth/index";

export default class RegisterController {
	async show({ inertia }: HttpContext) {
		return inertia.render("auth/register");
	}

	async store({ request, auth, response }: HttpContext) {
		const data = await request.validateUsing(registerValidator);

		const user = await authService.register({
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			password: data.password,
		});

		await auth.use("web").login(user);

		return response.redirect().toRoute("dashboard");
	}
}
