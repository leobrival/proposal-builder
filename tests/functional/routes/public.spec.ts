import { test } from "@japa/runner";

test.group("Public Routes", () => {
	test("landing page returns 200", async ({ client }) => {
		const response = await client.get("/");
		response.assertStatus(200);
	});

	test("login page returns 200", async ({ client }) => {
		const response = await client.get("/login");
		response.assertStatus(200);
	});

	test("register page returns 200", async ({ client }) => {
		const response = await client.get("/register");
		response.assertStatus(200);
	});

	test("waitlist POST redirects after submission", async ({ client }) => {
		const response = await client
			.post("/waitlist")
			.form({ email: `test-waitlist-${Date.now()}@example.com` });

		response.assertStatus(302);
	});

	test("public proposal with invalid slug returns 404", async ({ client }) => {
		const response = await client.get("/p/non-existent-slug-12345");
		response.assertStatus(404);
	});
});
