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
const BuilderController = () =>
	import("#controllers/proposals/builder_controller");
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
const EventImportController = () =>
	import("#controllers/api/event_import_controller");
const ProfileController = () => import("#controllers/profile_controller");
const BillingController = () =>
	import("#controllers/billing/billing_controller");
const WebhooksController = () =>
	import("#controllers/billing/webhooks_controller");
const ApiKeysController = () =>
	import("#controllers/api/api_keys_controller");
const McpController = () => import("#controllers/api/mcp_controller");
const BlogController = () => import("#controllers/blog_controller");
const DocsController = () => import("#controllers/docs_controller");
const ChangelogController = () => import("#controllers/changelog_controller");
const AssistantController = () =>
	import("#controllers/api/assistant_controller");

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

		// Profile routes
		router.get("/profile", [ProfileController, "show"]).as("profile.show");
		router.put("/profile", [ProfileController, "update"]).as("profile.update");
		router
			.put("/profile/password", [ProfileController, "updatePassword"])
			.as("profile.password");
		router
			.delete("/profile", [ProfileController, "destroy"])
			.as("profile.destroy");

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

		// Builder routes
		router
			.get("/proposals/:id/builder", [BuilderController, "show"])
			.as("proposals.builder");
		router
			.put("/proposals/:id/layout", [BuilderController, "update"])
			.as("proposals.layout.update");
		router
			.get("/proposals/:id/preview", [BuilderController, "preview"])
			.as("proposals.preview");

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

		// Event import API
		router
			.post("/api/events/preview", [EventImportController, "preview"])
			.as("api.events.preview");
		router
			.get("/api/events/platforms", [EventImportController, "platforms"])
			.as("api.events.platforms");
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

		// API endpoint for session analytics (countries, devices, browsers, OS)
		router
			.get("/api/session-analytics", [
				AdminMetricsController,
				"sessionAnalytics",
			])
			.as("admin.api.sessionAnalytics");

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
			.put("/api/proposals/:id/status", [
				AdminProposalsController,
				"updateStatus",
			])
			.as("admin.api.proposals.status");
		router
			.delete("/api/proposals/:id", [AdminProposalsController, "destroy"])
			.as("admin.api.proposals.destroy");
	})
	.prefix("/admin")
	.middleware([middleware.auth(), middleware.admin()]);

// Webhook routes (public - no auth required, verified by signature)
router
	.group(() => {
		router
			.post("/lemonsqueezy", [WebhooksController, "lemonsqueezy"])
			.as("webhooks.lemonsqueezy");
		router
			.post("/stripe", [WebhooksController, "stripe"])
			.as("webhooks.stripe");
	})
	.prefix("/webhooks");

// Billing routes (authenticated)
router
	.group(() => {
		router.get("/", [BillingController, "index"]).as("billing.index");
		router
			.post("/checkout", [BillingController, "checkout"])
			.as("billing.checkout");
		router
			.get("/success", [BillingController, "success"])
			.as("billing.success");
		router.get("/portal", [BillingController, "portal"]).as("billing.portal");
		router.post("/cancel", [BillingController, "cancel"]).as("billing.cancel");
		router.post("/resume", [BillingController, "resume"]).as("billing.resume");
	})
	.prefix("/billing")
	.middleware(middleware.auth());

// Billing API routes (authenticated)
router
	.group(() => {
		router
			.get("/billing/subscription", [BillingController, "getSubscription"])
			.as("api.billing.subscription");
	})
	.prefix("/api")
	.middleware(middleware.auth());

// API Keys management routes (authenticated)
router
	.group(() => {
		router.get("/", [ApiKeysController, "index"]).as("api.keys.index");
		router.post("/", [ApiKeysController, "store"]).as("api.keys.store");
		router.get("/usage", [ApiKeysController, "usage"]).as("api.keys.usage");
		router
			.post("/revoke-all", [ApiKeysController, "revokeAll"])
			.as("api.keys.revokeAll");
		router.get("/:id", [ApiKeysController, "show"]).as("api.keys.show");
		router.put("/:id", [ApiKeysController, "update"]).as("api.keys.update");
		router
			.delete("/:id", [ApiKeysController, "destroy"])
			.as("api.keys.destroy");
		router
			.get("/:id/usage", [ApiKeysController, "keyUsage"])
			.as("api.keys.keyUsage");
	})
	.prefix("/api/keys")
	.middleware(middleware.auth());

// MCP (Model Context Protocol) routes (API key authentication)
// MCP is accessible by ALL plans - no rate limiting
router
	.group(() => {
		router.get("/tools", [McpController, "listTools"]).as("mcp.tools");
		router
			.post("/tools/:name", [McpController, "executeTool"])
			.as("mcp.tools.execute");
		router
			.get("/limits", [McpController, "limits"])
			.as("mcp.limits");
	})
	.prefix("/mcp");

// Blog routes (public)
router
	.group(() => {
		router.get("/", [BlogController, "index"]).as("blog.index");
		router.get("/search", [BlogController, "search"]).as("blog.search");
		router.get("/feed.xml", [BlogController, "feed"]).as("blog.feed");
		router.get("/:slug", [BlogController, "show"]).as("blog.show");
	})
	.prefix("/blog");

// Documentation routes (public)
router
	.group(() => {
		router.get("/", [DocsController, "index"]).as("docs.index");
		router.get("/search", [DocsController, "search"]).as("docs.search");
		router.get("/:slug", [DocsController, "show"]).as("docs.show");
	})
	.prefix("/docs");

// Changelog routes (public)
router.get("/changelog", [ChangelogController, "index"]).as("changelog.index");

// Public content API routes
router
	.group(() => {
		router.get("/blog", [BlogController, "apiList"]).as("api.blog.list");
		router.get("/blog/:slug", [BlogController, "apiShow"]).as("api.blog.show");
		router.get("/docs", [DocsController, "apiList"]).as("api.docs.list");
		router.get("/docs/:slug", [DocsController, "apiShow"]).as("api.docs.show");
		router
			.get("/changelog", [ChangelogController, "apiList"])
			.as("api.changelog.list");
		router
			.get("/changelog/latest", [ChangelogController, "apiLatest"])
			.as("api.changelog.latest");
	})
	.prefix("/api/content");

// AI Assistant routes (public status, authenticated chat)
router
	.group(() => {
		router
			.get("/status", [AssistantController, "status"])
			.as("api.assistant.status");
		router
			.get("/suggestions", [AssistantController, "suggestions"])
			.as("api.assistant.suggestions");
		router
			.get("/search", [AssistantController, "search"])
			.as("api.assistant.search");
		router
			.post("/chat", [AssistantController, "chat"])
			.as("api.assistant.chat");
	})
	.prefix("/api/assistant");
