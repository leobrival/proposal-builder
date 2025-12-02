import { test } from "@japa/runner";

test.group("Auth Guard - Protected Routes", () => {
	test("dashboard requires authentication", async ({ client }) => {
		const response = await client.get("/dashboard");
		// Auth middleware redirects to login
		response.assertRedirectsTo("/login");
	});

	test("profile requires authentication", async ({ client }) => {
		const response = await client.get("/profile");
		response.assertRedirectsTo("/login");
	});

	test("proposals index requires authentication", async ({ client }) => {
		const response = await client.get("/proposals");
		response.assertRedirectsTo("/login");
	});

	test("proposals create requires authentication", async ({ client }) => {
		const response = await client.get("/proposals/new");
		response.assertRedirectsTo("/login");
	});

	test("admin dashboard requires authentication", async ({ client }) => {
		const response = await client.get("/admin/dashboard");
		response.assertRedirectsTo("/login");
	});

	test("admin API requires authentication", async ({ client }) => {
		const response = await client.get("/admin/api/metrics");
		response.assertRedirectsTo("/login");
	});
});
