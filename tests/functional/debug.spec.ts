import { test } from "@japa/runner";
import User from "#models/user";

test.group("Debug Admin API", (group) => {
	let adminUser: User;
	let regularUser: User;

	group.setup(async () => {
		adminUser = await User.create({
			firstName: "Admin",
			lastName: "Debug",
			email: `admin-debug-${Date.now()}@example.com`,
			password: "password123",
			role: "admin",
			plan: "free",
			isActive: true,
		});

		regularUser = await User.create({
			firstName: "Regular",
			lastName: "Debug",
			email: `regular-debug-${Date.now()}@example.com`,
			password: "password123",
			role: "user",
			plan: "free",
			isActive: true,
		});
	});

	group.teardown(async () => {
		if (regularUser) await regularUser.delete();
		if (adminUser) await adminUser.delete();
	});

	test("debug GET admin API works with loginAs", async ({ client }) => {
		const response = await client.get("/admin/api/routes").loginAs(adminUser);

		console.log("GET Status:", response.response.status);
		console.log("GET is JSON:", response.response.headers["content-type"]);
	});

	test("debug PUT with form instead of json", async ({ client }) => {
		const response = await client
			.put(`/admin/api/users/${regularUser.id}/plan`)
			.loginAs(adminUser)
			.form({ plan: "paid" });

		console.log("PUT Form Status:", response.response.status);
		console.log(
			"PUT Form Content-Type:",
			response.response.headers["content-type"],
		);
		console.log(
			"PUT Form Body:",
			JSON.stringify(response.body()).substring(0, 200),
		);
	});
});
