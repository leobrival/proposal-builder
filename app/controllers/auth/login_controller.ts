import type { HttpContext } from "@adonisjs/core/http";
import { InvalidCredentialsException } from "#exceptions/index";
import authService from "#services/auth_service";
import { loginValidator } from "#validators/auth/index";

export default class LoginController {
	async show({ inertia }: HttpContext) {
		return inertia.render("auth/login");
	}

	async store({ request, auth, response, session, logger }: HttpContext) {
		const { email, password } = await request.validateUsing(loginValidator);

		logger.info({ email }, "Login attempt");

		try {
			const user = await authService.verifyCredentials(email, password);

			logger.info({ userId: user.id }, "User verified successfully");
			await auth.use("web").login(user);
			logger.info("User logged in, redirecting to dashboard");
			session.flash("success", "Connexion reussie !");
			return response.redirect("/dashboard");
		} catch (error) {
			if (error instanceof InvalidCredentialsException) {
				logger.error({ email }, "Login failed");
				session.flash("error", "Email ou mot de passe incorrect");
				return response.redirect("/login");
			}
			throw error;
		}
	}
}
