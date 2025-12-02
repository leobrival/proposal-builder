import type { HttpContext } from "@adonisjs/core/http";
import { InvalidPasswordException } from "#exceptions/index";
import userService from "#services/user_service";
import {
	deleteAccountValidator,
	updatePasswordValidator,
	updateProfileValidator,
} from "#validators/user/index";

export default class ProfileController {
	async show({ inertia, auth }: HttpContext) {
		const user = auth.user!;

		return inertia.render("profile", {
			user: userService.getProfileData(user),
		});
	}

	async update({ request, response, auth, session }: HttpContext) {
		const user = auth.user!;
		const data = await request.validateUsing(updateProfileValidator);

		await userService.updateProfile(user, {
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
		});

		session.flash("success", "Profil mis a jour avec succes");
		return response.redirect().back();
	}

	async updatePassword({ request, response, auth, session }: HttpContext) {
		const user = auth.user!;
		const data = await request.validateUsing(updatePasswordValidator);

		try {
			await userService.updatePassword(user, {
				currentPassword: data.currentPassword,
				newPassword: data.newPassword,
			});

			session.flash("success", "Mot de passe mis a jour avec succes");
			return response.redirect().back();
		} catch (error) {
			if (error instanceof InvalidPasswordException) {
				session.flash("error", "Mot de passe actuel incorrect");
				return response.redirect().back();
			}
			throw error;
		}
	}

	async destroy({ request, response, auth, session }: HttpContext) {
		const user = auth.user!;
		const data = await request.validateUsing(deleteAccountValidator);

		try {
			await userService.deleteAccount(user, data.password);
			await auth.use("web").logout();

			session.flash("success", "Compte supprime avec succes");
			return response.redirect("/");
		} catch (error) {
			if (error instanceof InvalidPasswordException) {
				session.flash("error", "Mot de passe incorrect");
				return response.redirect().back();
			}
			throw error;
		}
	}
}
