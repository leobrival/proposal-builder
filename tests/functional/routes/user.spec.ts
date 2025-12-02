import { test } from "@japa/runner";
import Proposal from "#models/proposal";
import User from "#models/user";

test.group("User Routes - Authenticated", (group) => {
	let testUser: User;
	let testProposal: Proposal;

	group.setup(async () => {
		// Create a test user
		testUser = await User.create({
			firstName: "Test",
			lastName: "User",
			email: `testuser-${Date.now()}@example.com`,
			password: "password123",
			role: "user",
			plan: "free",
			isActive: true,
		});

		// Create a test proposal
		testProposal = await Proposal.create({
			userId: testUser.id,
			title: "Test Proposal",
			projectName: "Test Project",
			contactEmail: testUser.email,
			status: "draft",
		});
	});

	group.teardown(async () => {
		// Clean up
		if (testProposal) {
			await testProposal.delete();
		}
		if (testUser) {
			await testUser.delete();
		}
	});

	// Page access tests
	test("dashboard returns 200 when authenticated", async ({ client }) => {
		const response = await client.get("/dashboard").loginAs(testUser);
		response.assertStatus(200);
	});

	test("profile returns 200 when authenticated", async ({ client }) => {
		const response = await client.get("/profile").loginAs(testUser);
		response.assertStatus(200);
	});

	test("proposals index returns 200 when authenticated", async ({ client }) => {
		const response = await client.get("/proposals").loginAs(testUser);
		response.assertStatus(200);
	});

	test("proposals new returns 200 when authenticated", async ({ client }) => {
		const response = await client.get("/proposals/new").loginAs(testUser);
		response.assertStatus(200);
	});

	test("proposal edit returns 200 for own proposal", async ({ client }) => {
		const response = await client
			.get(`/proposals/${testProposal.id}/edit`)
			.loginAs(testUser);
		response.assertStatus(200);
	});

	test("proposal builder returns 200 for own proposal", async ({ client }) => {
		const response = await client
			.get(`/proposals/${testProposal.id}/builder`)
			.loginAs(testUser);
		response.assertStatus(200);
	});

	test("proposal preview returns 200 for own proposal", async ({ client }) => {
		const response = await client
			.get(`/proposals/${testProposal.id}/preview`)
			.loginAs(testUser);
		response.assertStatus(200);
	});

	test("proposal domain returns 200 for own proposal", async ({ client }) => {
		const response = await client
			.get(`/proposals/${testProposal.id}/domain`)
			.loginAs(testUser);
		response.assertStatus(200);
	});

	// Form submission tests (CSRF disabled in test environment)
	test("can create a new proposal", async ({ client }) => {
		const response = await client.post("/proposals").loginAs(testUser).form({
			title: "New Test Proposal",
			projectName: "New Test Project",
			contactEmail: testUser.email,
		});

		response.assertStatus(302);

		// Clean up the created proposal
		const newProposal = await Proposal.query()
			.where("title", "New Test Proposal")
			.where("userId", testUser.id)
			.first();
		if (newProposal) {
			await newProposal.delete();
		}
	});

	test("can update own proposal", async ({ client }) => {
		const response = await client
			.put(`/proposals/${testProposal.id}`)
			.loginAs(testUser)
			.form({
				title: "Updated Test Proposal",
				projectName: "Test Project",
				contactEmail: testUser.email,
			});

		response.assertStatus(302);
	});

	test("can publish own proposal", async ({ client }) => {
		const response = await client
			.post(`/proposals/${testProposal.id}/publish`)
			.loginAs(testUser);

		response.assertStatus(302);

		// Revert to draft
		await testProposal.refresh();
		testProposal.status = "draft";
		await testProposal.save();
	});

	test("profile update works", async ({ client }) => {
		const response = await client.put("/profile").loginAs(testUser).form({
			firstName: "Updated",
			lastName: "User",
			email: testUser.email,
		});

		response.assertStatus(302);
	});

	// API tests
	test("API events platforms returns 200", async ({ client }) => {
		const response = await client
			.get("/api/events/platforms")
			.loginAs(testUser);

		response.assertStatus(200);
	});

	test("domain check subdomain returns availability", async ({ client }) => {
		const response = await client
			.get("/domain/check-subdomain")
			.loginAs(testUser)
			.qs({ subdomain: `test-${Date.now()}` });

		response.assertStatus(200);
		response.assertBodyContains({ available: true });
	});
});
