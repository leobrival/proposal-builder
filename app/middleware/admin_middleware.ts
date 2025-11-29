import type { HttpContext } from "@adonisjs/core/http";
import type { NextFn } from "@adonisjs/core/types/http";

/**
 * Admin middleware ensures the authenticated user has admin role.
 * Must be used after auth middleware.
 */
export default class AdminMiddleware {
	async handle(ctx: HttpContext, next: NextFn) {
		const user = ctx.auth.user;

		if (!user) {
			return ctx.response.redirect().toRoute("auth.login");
		}

		if (user.role !== "admin") {
			ctx.session.flash("error", "Access denied. Admin privileges required.");
			return ctx.response.redirect().toRoute("dashboard");
		}

		if (!user.isActive) {
			ctx.session.flash("error", "Your account has been deactivated.");
			await ctx.auth.use("web").logout();
			return ctx.response.redirect().toRoute("auth.login");
		}

		return next();
	}
}
