import { BaseSeeder } from "@adonisjs/lucid/seeders";
import { DateTime } from "luxon";
import Lead from "#models/lead";
import Proposal from "#models/proposal";
import User from "#models/user";

/**
 * Large Scale Seeder - Creates 18 months of realistic data
 * Simulates organic growth pattern:
 * - Slow start (months 1-3)
 * - Growth phase (months 4-9)
 * - Acceleration (months 10-15)
 * - Current momentum (months 16-18)
 */
export default class extends BaseSeeder {
	async run() {
		console.log("Cleaning existing data (except admin)...");

		// Delete in order due to foreign key constraints
		await Lead.query().delete();
		await Proposal.query().delete();
		await User.query().where("role", "user").delete();

		console.log("Creating large-scale demo data over 18 months...");

		const users = await this.createUsers();
		console.log(`Created ${users.length} users`);

		const proposals = await this.createProposals(users);
		console.log(`Created ${proposals.length} proposals`);

		const leads = await this.createLeads(proposals);
		console.log(`Created ${leads.length} leads`);

		// Print summary by month
		await this.printSummary();

		console.log("\nLarge-scale demo data seeding complete!");
	}

	private async createUsers(): Promise<User[]> {
		const now = DateTime.now();
		const users: User[] = [];

		// Growth curve: users per month over 18 months
		// Simulates: slow start -> growth -> acceleration
		const usersPerMonth = [
			3,
			5,
			7, // Months 1-3: Early adopters (15 users)
			12,
			15,
			18, // Months 4-6: Initial growth (45 users)
			22,
			28,
			35, // Months 7-9: Growth phase (85 users)
			42,
			50,
			58, // Months 10-12: Acceleration (150 users)
			65,
			72,
			80, // Months 13-15: Strong growth (217 users)
			88,
			95,
			45, // Months 16-18: Current momentum (228 users)
		];

		const firstNames = [
			"Alice",
			"Bob",
			"Claire",
			"David",
			"Emma",
			"Florian",
			"Gabrielle",
			"Hugo",
			"Isabelle",
			"Julien",
			"Karine",
			"Lucas",
			"Marie",
			"Nicolas",
			"Olivia",
			"Pierre",
			"Quentin",
			"Rachel",
			"Simon",
			"Tania",
			"Ugo",
			"Valerie",
			"William",
			"Xavier",
			"Yasmine",
			"Zoe",
			"Antoine",
			"Beatrice",
			"Cedric",
			"Delphine",
			"Etienne",
			"Fanny",
			"Guillaume",
			"Helene",
			"Ivan",
			"Julie",
			"Kevin",
			"Laure",
			"Marc",
			"Nadia",
			"Oscar",
			"Pauline",
			"Romain",
			"Sophie",
			"Thomas",
			"Ursula",
			"Victor",
			"Wendy",
			"Yann",
			"Zohra",
			"Adrien",
			"Brigitte",
			"Christophe",
			"Diane",
			"Eric",
			"Francoise",
			"Gerard",
			"Henriette",
			"Igor",
			"Jacqueline",
			"Karl",
			"Lucie",
			"Mathieu",
			"Nathalie",
			"Olivier",
			"Patricia",
			"Quentin",
			"Renee",
			"Sebastien",
			"Therese",
			"Ulrich",
			"Veronique",
			"Willy",
			"Xaviere",
			"Yohan",
			"Zara",
			"Arnaud",
			"Bernadette",
			"Cyril",
			"Dominique",
		];

		const lastNames = [
			"Martin",
			"Bernard",
			"Thomas",
			"Petit",
			"Robert",
			"Richard",
			"Durand",
			"Dubois",
			"Moreau",
			"Laurent",
			"Simon",
			"Michel",
			"Lefebvre",
			"Leroy",
			"Roux",
			"David",
			"Bertrand",
			"Morel",
			"Fournier",
			"Girard",
			"Bonnet",
			"Dupont",
			"Lambert",
			"Fontaine",
			"Rousseau",
			"Vincent",
			"Muller",
			"Lefevre",
			"Faure",
			"Andre",
			"Mercier",
			"Blanc",
			"Guerin",
			"Boyer",
			"Garnier",
			"Chevalier",
			"Francois",
			"Legrand",
			"Gauthier",
			"Garcia",
			"Perrin",
			"Robin",
			"Clement",
			"Morin",
			"Nicolas",
			"Henry",
			"Roussel",
			"Mathieu",
			"Gautier",
			"Masson",
			"Marchand",
			"Duval",
			"Denis",
			"Dumont",
			"Marie",
			"Lemaire",
			"Noel",
			"Meyer",
			"Dufour",
			"Meunier",
			"Brun",
			"Blanchard",
			"Giraud",
			"Joly",
			"Riviere",
		];

		let userIndex = 0;

		for (let monthsAgo = 17; monthsAgo >= 0; monthsAgo--) {
			const monthIndex = 17 - monthsAgo;
			const numUsers = usersPerMonth[monthIndex];

			for (let i = 0; i < numUsers; i++) {
				// Random day within the month
				const dayInMonth = Math.floor(Math.random() * 28) + 1;
				const createdAt = now
					.minus({ months: monthsAgo })
					.set({ day: dayInMonth });

				// Skip if date is in the future
				if (createdAt > now) continue;

				const firstName = firstNames[userIndex % firstNames.length];
				const lastName = lastNames[userIndex % lastNames.length];
				const emailSuffix = userIndex > 0 ? userIndex.toString() : "";

				const user = await User.create({
					firstName,
					lastName,
					email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${emailSuffix}@example.com`,
					password: "password123",
					role: "user",
					isActive: Math.random() > 0.05, // 95% active
					createdAt,
					updatedAt: createdAt,
				});

				users.push(user);
				userIndex++;
			}
		}

		return users;
	}

	private async createProposals(users: User[]): Promise<Proposal[]> {
		const now = DateTime.now();
		const proposals: Proposal[] = [];

		const proposalTemplates = [
			{
				title: "YouTube Tech Review Partnership",
				projectName: "TechTalk Reviews",
				category: "tech",
			},
			{
				title: "Fitness Instagram Collaboration",
				projectName: "FitLife Daily",
				category: "fitness",
			},
			{
				title: "Gaming Twitch Sponsorship",
				projectName: "GameStream Pro",
				category: "gaming",
			},
			{
				title: "Food Blog Collaboration",
				projectName: "Gourmet Adventures",
				category: "food",
			},
			{
				title: "Travel Vlog Sponsorship",
				projectName: "Wanderlust Diaries",
				category: "travel",
			},
			{
				title: "Fashion Influencer Partnership",
				projectName: "Style Maven",
				category: "fashion",
			},
			{
				title: "Podcast Advertising Opportunity",
				projectName: "The Daily Insight",
				category: "podcast",
			},
			{
				title: "Photography Portfolio Sponsorship",
				projectName: "Lens & Light",
				category: "photo",
			},
			{
				title: "Music Channel Collaboration",
				projectName: "Melody Makers",
				category: "music",
			},
			{
				title: "DIY & Crafts Partnership",
				projectName: "Creative Corner",
				category: "diy",
			},
			{
				title: "Beauty Tutorial Sponsorship",
				projectName: "Glam Guide",
				category: "beauty",
			},
			{
				title: "Parenting Blog Collaboration",
				projectName: "Family First",
				category: "parenting",
			},
			{
				title: "Finance Education Partnership",
				projectName: "Money Matters",
				category: "finance",
			},
			{
				title: "Pet Content Sponsorship",
				projectName: "Pawsome Life",
				category: "pets",
			},
			{
				title: "Home Decor Partnership",
				projectName: "Interior Dreams",
				category: "home",
			},
		];

		const colors = [
			{ primary: "#3B82F6", secondary: "#1E40AF" },
			{ primary: "#10B981", secondary: "#059669" },
			{ primary: "#8B5CF6", secondary: "#6D28D9" },
			{ primary: "#F59E0B", secondary: "#D97706" },
			{ primary: "#EF4444", secondary: "#DC2626" },
			{ primary: "#EC4899", secondary: "#DB2777" },
			{ primary: "#06B6D4", secondary: "#0891B2" },
			{ primary: "#84CC16", secondary: "#65A30D" },
		];

		// Status distribution changes over time (maturity)
		const getStatusForAge = (
			monthsOld: number,
		): "published" | "draft" | "archived" => {
			const rand = Math.random();
			if (monthsOld > 12) {
				// Old proposals: more archived
				if (rand < 0.5) return "published";
				if (rand < 0.7) return "archived";
				return "draft";
			} else if (monthsOld > 6) {
				// Medium age: mostly published
				if (rand < 0.7) return "published";
				if (rand < 0.85) return "draft";
				return "archived";
			} else {
				// Recent: more drafts
				if (rand < 0.55) return "published";
				if (rand < 0.9) return "draft";
				return "archived";
			}
		};

		for (const user of users) {
			const userCreatedAt = user.createdAt;
			const userAgeMonths = now.diff(userCreatedAt, "months").months;

			// Activation rate improves over time (learning from early users)
			// Early users: 50% create proposals, Recent users: 75%
			const activationChance = 0.5 + (Math.min(userAgeMonths, 12) / 12) * 0.25;

			if (Math.random() > activationChance) continue;

			// Number of proposals per user (power law distribution)
			const rand = Math.random();
			const numProposals =
				rand < 0.6 ? 1 : rand < 0.85 ? 2 : rand < 0.95 ? 3 : 4;

			for (let j = 0; j < numProposals; j++) {
				const template =
					proposalTemplates[
						Math.floor(Math.random() * proposalTemplates.length)
					];
				const color = colors[Math.floor(Math.random() * colors.length)];

				// Proposal created 1-60 days after user signup
				const daysAfterSignup = Math.floor(Math.random() * 60) + 1;
				const proposalCreatedAt = userCreatedAt.plus({ days: daysAfterSignup });

				if (proposalCreatedAt > now) continue;

				const monthsOld = now.diff(proposalCreatedAt, "months").months;
				const status = getStatusForAge(monthsOld);

				const viewCount =
					status === "published"
						? Math.floor(Math.random() * 1000) + Math.floor(monthsOld * 50)
						: 0;

				const proposal = await Proposal.create({
					userId: user.id,
					title: `${template.title} - ${user.fullName.split(" ")[0]}`,
					description: `Sponsorship opportunity for ${template.category} brands`,
					projectName: template.projectName,
					projectDescription: `Professional ${template.category} content creation`,
					contactEmail: user.email,
					status,
					viewCount,
					publishedAt:
						status === "published" ? proposalCreatedAt.plus({ days: 1 }) : null,
					designSettings: {
						primaryColor: color.primary,
						secondaryColor: color.secondary,
						fontFamily: "Inter",
						logoPosition: "left",
						layout: "modern",
					},
					createdAt: proposalCreatedAt,
					updatedAt: proposalCreatedAt,
				});

				proposals.push(proposal);
			}
		}

		return proposals;
	}

	private async createLeads(proposals: Proposal[]): Promise<Lead[]> {
		const now = DateTime.now();
		const leads: Lead[] = [];

		const companies = [
			"TechCorp",
			"InnovateLab",
			"Digital Agency",
			"StartupHub",
			"MediaGroup",
			"BrandCo",
			"MarketingPro",
			"CreativeStudio",
			"GrowthPartners",
			"VentureWorks",
			"AdTech Solutions",
			"ContentFirst",
			"EngageMedia",
			"SocialBoost",
			"InfluencerConnect",
			"NextGen Marketing",
			"Digital Frontier",
			"Brand Builders",
			"Creative Minds",
			"Impact Agency",
			"Viral Ventures",
			"Content Kings",
			"Social Stars",
			"Media Masters",
			"Brand Boost",
		];

		const firstNames = [
			"Jean",
			"Marie",
			"Pierre",
			"Sophie",
			"Michel",
			"Anne",
			"Philippe",
			"Catherine",
			"Alain",
			"Christine",
			"François",
			"Nathalie",
			"Patrick",
			"Isabelle",
			"Bernard",
			"Sylvie",
			"Laurent",
			"Martine",
			"Olivier",
			"Sandrine",
			"Thierry",
			"Valerie",
		];

		const lastNames = [
			"Dupont",
			"Martin",
			"Bernard",
			"Thomas",
			"Robert",
			"Richard",
			"Petit",
			"Durand",
			"Moreau",
			"Laurent",
			"Simon",
			"Michel",
			"Lefebvre",
			"Leroy",
			"Roux",
			"David",
		];

		const messages = [
			"Interested in discussing a potential partnership",
			"Would love to learn more about your sponsorship tiers",
			"Our brand aligns well with your content",
			"Looking for influencer collaborations for Q1",
			"Can we schedule a call to discuss opportunities?",
			"We have a campaign launching next month",
			"Your audience demographics match our target market",
			"Impressed by your engagement rates",
			"We're expanding our influencer program",
			"Looking for long-term partnership opportunities",
			null,
			null, // Some leads don't leave messages
		];

		const publishedProposals = proposals.filter(
			(p) => p.status === "published",
		);

		for (const proposal of publishedProposals) {
			const proposalAge = now.diff(
				proposal.publishedAt || proposal.createdAt,
				"months",
			).months;

			// Leads increase with proposal age and maturity
			// Older proposals have had more time to accumulate leads
			const baseLeads = Math.floor(proposalAge * 1.5);
			const numLeads = Math.floor(Math.random() * (baseLeads + 5));

			for (let i = 0; i < numLeads; i++) {
				const firstName =
					firstNames[Math.floor(Math.random() * firstNames.length)];
				const lastName =
					lastNames[Math.floor(Math.random() * lastNames.length)];
				const company = companies[Math.floor(Math.random() * companies.length)];

				// Lead created sometime after proposal was published
				const maxDaysAfter = Math.min(
					proposalAge * 30,
					now.diff(proposal.publishedAt || proposal.createdAt, "days").days,
				);
				const daysAfterPublish = Math.floor(
					Math.random() * Math.max(1, maxDaysAfter),
				);
				const leadCreatedAt = (proposal.publishedAt || proposal.createdAt).plus(
					{ days: daysAfterPublish },
				);

				if (leadCreatedAt > now) continue;

				// Status distribution based on lead age
				const leadAgeMonths = now.diff(leadCreatedAt, "months").months;
				let status: "new" | "contacted" | "pending" | "converted" | "rejected";

				if (leadAgeMonths < 1) {
					// Recent leads: mostly new
					const rand = Math.random();
					status = rand < 0.6 ? "new" : rand < 0.8 ? "contacted" : "pending";
				} else if (leadAgeMonths < 3) {
					// Medium age: in progress
					const rand = Math.random();
					status =
						rand < 0.2
							? "new"
							: rand < 0.5
								? "contacted"
								: rand < 0.7
									? "pending"
									: rand < 0.85
										? "converted"
										: "rejected";
				} else {
					// Old leads: resolved
					const rand = Math.random();
					status =
						rand < 0.05
							? "new"
							: rand < 0.1
								? "contacted"
								: rand < 0.2
									? "pending"
									: rand < 0.7
										? "converted"
										: "rejected";
				}

				const lead = await Lead.create({
					proposalId: proposal.id,
					name: `${firstName} ${lastName}`,
					email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/\s+/g, "")}.com`,
					company,
					phone:
						Math.random() > 0.4
							? `+33 6 ${Math.floor(Math.random() * 90000000 + 10000000)}`
							: null,
					message: messages[Math.floor(Math.random() * messages.length)],
					status,
					notes:
						status === "converted"
							? "Deal closed successfully"
							: status === "rejected"
								? "Budget constraints"
								: null,
					createdAt: leadCreatedAt,
					updatedAt: leadCreatedAt,
				});

				leads.push(lead);
			}
		}

		return leads;
	}

	private async printSummary() {
		const now = DateTime.now();

		console.log("\n--- Monthly Summary ---");

		for (let monthsAgo = 17; monthsAgo >= 0; monthsAgo--) {
			const startOfMonth = now.minus({ months: monthsAgo }).startOf("month");
			const endOfMonth = startOfMonth.endOf("month");

			const users = await User.query()
				.where("createdAt", ">=", startOfMonth.toSQL()!)
				.where("createdAt", "<=", endOfMonth.toSQL()!)
				.count("* as count");

			const proposals = await Proposal.query()
				.where("createdAt", ">=", startOfMonth.toSQL()!)
				.where("createdAt", "<=", endOfMonth.toSQL()!)
				.count("* as count");

			const leads = await Lead.query()
				.where("createdAt", ">=", startOfMonth.toSQL()!)
				.where("createdAt", "<=", endOfMonth.toSQL()!)
				.count("* as count");

			const monthName = startOfMonth.toFormat("MMM yyyy");
			console.log(
				`${monthName}: ${Number(users[0].$extras.count)} users, ${Number(proposals[0].$extras.count)} proposals, ${Number(leads[0].$extras.count)} leads`,
			);
		}
	}
}
