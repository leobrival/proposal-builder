import { BaseSeeder } from "@adonisjs/lucid/seeders";
import Proposal from "#models/proposal";
import User from "#models/user";

export default class extends BaseSeeder {
	async run() {
		const user = await User.query().first();

		if (!user) {
			console.log("No user found. Please register first.");
			return;
		}

		console.log(`Creating proposals for user: ${user.email}`);

		await Proposal.createMany([
			{
				userId: user.id,
				title: "Tech Review Channel Sponsorship",
				description:
					"Partnership opportunity for my tech review YouTube channel with 45K engaged subscribers.",
				projectName: "TechTalk Reviews",
				projectDescription:
					"Weekly in-depth tech reviews covering smartphones, laptops, and gadgets. Our audience is 70% male, aged 25-34, with high purchasing intent.",
				contactEmail: user.email,
				status: "published",
				viewCount: 127,
				designSettings: {
					primaryColor: "#3B82F6",
					secondaryColor: "#1E40AF",
					fontFamily: "Inter",
					logoPosition: "left",
					layout: "modern",
				},
			},
			{
				userId: user.id,
				title: "Fitness Influencer Collaboration",
				description:
					"Sponsorship proposal for health and fitness brands looking to reach active lifestyle enthusiasts.",
				projectName: "FitLife with Leo",
				projectDescription:
					"Daily fitness content on Instagram and TikTok. 28K followers with 4.2% engagement rate. Specializing in home workouts and nutrition tips.",
				contactEmail: user.email,
				status: "draft",
				viewCount: 0,
				designSettings: {
					primaryColor: "#10B981",
					secondaryColor: "#059669",
					fontFamily: "Inter",
					logoPosition: "center",
					layout: "minimal",
				},
			},
		]);

		console.log("Created 2 example proposals!");
	}
}
