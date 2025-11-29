/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from "@adonisjs/core/services/router";
import transmit from "@adonisjs/transmit/services/main";
import { middleware } from "./kernel.js";

// Register Transmit routes for SSE
transmit.registerRoutes();

const RegisterController = () =>
	import("#controllers/auth/register_controller");
const LoginController = () => import("#controllers/auth/login_controller");
const LogoutController = () => import("#controllers/auth/logout_controller");
const ProposalsController = () =>
	import("#controllers/proposals/proposals_controller");
const DomainsController = () =>
	import("#controllers/proposals/domains_controller");
const DashboardController = () => import("#controllers/dashboard_controller");
const LandingsController = () => import("#controllers/landings_controller");
const WaitlistsController = () => import("#controllers/waitlists_controller");
const PublicProposalsController = () =>
	import("#controllers/public_proposals_controller");
const SubdomainController = () => import("#controllers/subdomain_controller");
const AdminDashboardController = () =>
	import("#controllers/admin/dashboard_controller");
const AdminUsersController = () =>
	import("#controllers/admin/users_controller");
const AdminProposalsController = () =>
	import("#controllers/admin/proposals_controller");
const AdminMetricsController = () =>
	import("#controllers/admin/metrics_controller");
const AdminRoutesController = () =>
	import("#controllers/admin/routes_controller");

// Subdomain routes (e.g., techtalks.localhost:3333 or techtalks.sponseasy.com)
router
	.group(() => {
		router.get("/", [SubdomainController, "handle"]).as("subdomain.index");
		router.get("/*", [SubdomainController, "handle"]).as("subdomain.catchall");
	})
	.domain(":subdomain.localhost");

router.get("/", [LandingsController, "index"]).as("landing");

// Public proposal page (accessible without auth)
router
	.get("/p/:slug", [PublicProposalsController, "show"])
	.as("proposals.public");
router.post("/waitlist", [WaitlistsController, "store"]).as("waitlist.store");

// Auth routes (guest only)
router
	.group(() => {
		router.get("/register", [RegisterController, "show"]).as("register.show");
		router
			.post("/register", [RegisterController, "store"])
			.as("register.store");
		router.get("/login", [LoginController, "show"]).as("login.show");
		router.post("/login", [LoginController, "store"]).as("login.store");
	})
	.middleware(middleware.guest());

// Logout (authenticated only)
router
	.post("/logout", [LogoutController, "handle"])
	.as("logout")
	.middleware(middleware.auth());

// Dashboard and proposals (authenticated only)
router
	.group(() => {
		router.get("/dashboard", [DashboardController, "index"]).as("dashboard");

		// Proposals routes
		router
			.get("/proposals", [ProposalsController, "index"])
			.as("proposals.index");
		router
			.get("/proposals/new", [ProposalsController, "create"])
			.as("proposals.create");
		router
			.post("/proposals", [ProposalsController, "store"])
			.as("proposals.store");
		router
			.get("/proposals/:id/edit", [ProposalsController, "edit"])
			.as("proposals.edit");
		router
			.put("/proposals/:id", [ProposalsController, "update"])
			.as("proposals.update");
		router
			.delete("/proposals/:id", [ProposalsController, "destroy"])
			.as("proposals.destroy");
		router
			.post("/proposals/:id/publish", [ProposalsController, "publish"])
			.as("proposals.publish");
		router
			.post("/proposals/:id/unpublish", [ProposalsController, "unpublish"])
			.as("proposals.unpublish");

		// Domain management routes
		router
			.get("/proposals/:id/domain", [DomainsController, "show"])
			.as("proposals.domain.show");
		router
			.post("/proposals/:id/domain/subdomain", [
				DomainsController,
				"setSubdomain",
			])
			.as("proposals.domain.subdomain.set");
		router
			.delete("/proposals/:id/domain/subdomain", [
				DomainsController,
				"removeSubdomain",
			])
			.as("proposals.domain.subdomain.remove");
		router
			.post("/proposals/:id/domain/custom", [
				DomainsController,
				"setCustomDomain",
			])
			.as("proposals.domain.custom.set");
		router
			.delete("/proposals/:id/domain/custom", [
				DomainsController,
				"removeCustomDomain",
			])
			.as("proposals.domain.custom.remove");
		router
			.post("/proposals/:id/domain/verify", [DomainsController, "verifyDomain"])
			.as("proposals.domain.verify");

		// Domain availability checks
		router
			.get("/domain/check-subdomain", [
				DomainsController,
				"checkSubdomainAvailability",
			])
			.as("domain.check.subdomain");
		router
			.get("/domain/check-custom", [
				DomainsController,
				"checkCustomDomainAvailability",
			])
			.as("domain.check.custom");
	})
	.middleware(middleware.auth());

// Admin routes (authenticated + admin role required)
router
	.group(() => {
		// Dashboard
		router
			.get("/dashboard", [AdminDashboardController, "index"])
			.as("admin.dashboard");

		// API endpoint for real-time metrics
		router
			.get("/api/metrics", [AdminMetricsController, "index"])
			.as("admin.api.metrics");

		// API endpoint for routes listing
		router
			.get("/api/routes", [AdminRoutesController, "index"])
			.as("admin.api.routes");

		// Users API management
		router
			.put("/api/users/:id/plan", [AdminUsersController, "updatePlan"])
			.as("admin.api.users.plan");
		router
			.put("/api/users/:id/admin", [AdminUsersController, "updateAdmin"])
			.as("admin.api.users.admin");
		router
			.put("/api/users/:id/block", [AdminUsersController, "updateBlock"])
			.as("admin.api.users.block");
		router
			.delete("/api/users/:id", [AdminUsersController, "destroy"])
			.as("admin.api.users.destroy");

		// Proposals API management
		router
			.put("/api/proposals/:id/status", [AdminProposalsController, "updateStatus"])
			.as("admin.api.proposals.status");
		router
			.delete("/api/proposals/:id", [AdminProposalsController, "destroy"])
			.as("admin.api.proposals.destroy");
	})
	.prefix("/admin")
	.middleware([middleware.auth(), middleware.admin()]);
