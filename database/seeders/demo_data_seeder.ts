import { BaseSeeder } from "@adonisjs/lucid/seeders";
import { DateTime } from "luxon";
import Lead from "#models/lead";
import Proposal from "#models/proposal";
import User from "#models/user";

export default class extends BaseSeeder {
	async run() {
		console.log("Cleaning existing data (except admin)...");

		// Delete leads first (foreign key constraint)
		await Lead.query().delete();
		// Delete proposals
		await Proposal.query().delete();
		// Delete non-admin users
		await User.query().where("role", "user").delete();

		console.log("Creating users over the past 6 months...");

		const users = await this.createUsers();
		console.log(`Created ${users.length} users`);

		console.log("Creating proposals...");
		const proposals = await this.createProposals(users);
		console.log(`Created ${proposals.length} proposals`);

		console.log("Creating leads...");
		const leads = await this.createLeads(proposals);
		console.log(`Created ${leads.length} leads`);

		console.log("Demo data seeding complete!");
	}

	private async createUsers(): Promise<User[]> {
		const now = DateTime.now();
		const users: User[] = [];

		// User data with varied creation dates
		const userData = [
			// 6 months ago - early adopters
			{
				firstName: "Alice",
				lastName: "Martin",
				email: "alice.martin@example.com",
				daysAgo: 180,
			},
			{
				firstName: "Bob",
				lastName: "Dupont",
				email: "bob.dupont@example.com",
				daysAgo: 175,
			},
			{
				firstName: "Claire",
				lastName: "Lefebvre",
				email: "claire.lefebvre@example.com",
				daysAgo: 168,
			},

			// 5 months ago
			{
				firstName: "David",
				lastName: "Bernard",
				email: "david.bernard@example.com",
				daysAgo: 150,
			},
			{
				firstName: "Emma",
				lastName: "Petit",
				email: "emma.petit@example.com",
				daysAgo: 145,
			},
			{
				firstName: "Florian",
				lastName: "Moreau",
				email: "florian.moreau@example.com",
				daysAgo: 140,
			},
			{
				firstName: "Gabrielle",
				lastName: "Simon",
				email: "gabrielle.simon@example.com",
				daysAgo: 135,
			},

			// 4 months ago
			{
				firstName: "Hugo",
				lastName: "Laurent",
				email: "hugo.laurent@example.com",
				daysAgo: 120,
			},
			{
				firstName: "Isabelle",
				lastName: "Michel",
				email: "isabelle.michel@example.com",
				daysAgo: 115,
			},
			{
				firstName: "Julien",
				lastName: "Garcia",
				email: "julien.garcia@example.com",
				daysAgo: 110,
			},
			{
				firstName: "Karine",
				lastName: "David",
				email: "karine.david@example.com",
				daysAgo: 105,
			},
			{
				firstName: "Lucas",
				lastName: "Roux",
				email: "lucas.roux@example.com",
				daysAgo: 100,
			},

			// 3 months ago - growth phase
			{
				firstName: "Marie",
				lastName: "Fournier",
				email: "marie.fournier@example.com",
				daysAgo: 90,
			},
			{
				firstName: "Nicolas",
				lastName: "Morel",
				email: "nicolas.morel@example.com",
				daysAgo: 88,
			},
			{
				firstName: "Olivia",
				lastName: "Girard",
				email: "olivia.girard@example.com",
				daysAgo: 85,
			},
			{
				firstName: "Pierre",
				lastName: "Andre",
				email: "pierre.andre@example.com",
				daysAgo: 82,
			},
			{
				firstName: "Quentin",
				lastName: "Lefevre",
				email: "quentin.lefevre@example.com",
				daysAgo: 78,
			},
			{
				firstName: "Rachel",
				lastName: "Mercier",
				email: "rachel.mercier@example.com",
				daysAgo: 75,
			},
			{
				firstName: "Simon",
				lastName: "Dupuis",
				email: "simon.dupuis@example.com",
				daysAgo: 72,
			},
			{
				firstName: "Tania",
				lastName: "Lambert",
				email: "tania.lambert@example.com",
				daysAgo: 68,
			},

			// 2 months ago
			{
				firstName: "Ugo",
				lastName: "Bonnet",
				email: "ugo.bonnet@example.com",
				daysAgo: 60,
			},
			{
				firstName: "Valerie",
				lastName: "Francois",
				email: "valerie.francois@example.com",
				daysAgo: 58,
			},
			{
				firstName: "William",
				lastName: "Martinez",
				email: "william.martinez@example.com",
				daysAgo: 55,
			},
			{
				firstName: "Xavier",
				lastName: "Legrand",
				email: "xavier.legrand@example.com",
				daysAgo: 52,
			},
			{
				firstName: "Yasmine",
				lastName: "Faure",
				email: "yasmine.faure@example.com",
				daysAgo: 48,
			},
			{
				firstName: "Zoe",
				lastName: "Rousseau",
				email: "zoe.rousseau@example.com",
				daysAgo: 45,
			},
			{
				firstName: "Antoine",
				lastName: "Blanc",
				email: "antoine.blanc@example.com",
				daysAgo: 42,
			},
			{
				firstName: "Beatrice",
				lastName: "Guerin",
				email: "beatrice.guerin@example.com",
				daysAgo: 40,
			},

			// 1 month ago - acceleration
			{
				firstName: "Cedric",
				lastName: "Muller",
				email: "cedric.muller@example.com",
				daysAgo: 30,
			},
			{
				firstName: "Delphine",
				lastName: "Henry",
				email: "delphine.henry@example.com",
				daysAgo: 28,
			},
			{
				firstName: "Etienne",
				lastName: "Roussel",
				email: "etienne.roussel@example.com",
				daysAgo: 26,
			},
			{
				firstName: "Fanny",
				lastName: "Masson",
				email: "fanny.masson@example.com",
				daysAgo: 24,
			},
			{
				firstName: "Guillaume",
				lastName: "Chevalier",
				email: "guillaume.chevalier@example.com",
				daysAgo: 22,
			},
			{
				firstName: "Helene",
				lastName: "Dubois",
				email: "helene.dubois@example.com",
				daysAgo: 20,
			},
			{
				firstName: "Ivan",
				lastName: "Perrin",
				email: "ivan.perrin@example.com",
				daysAgo: 18,
			},
			{
				firstName: "Julie",
				lastName: "Clement",
				email: "julie.clement@example.com",
				daysAgo: 16,
			},
			{
				firstName: "Kevin",
				lastName: "Gauthier",
				email: "kevin.gauthier@example.com",
				daysAgo: 14,
			},
			{
				firstName: "Laure",
				lastName: "Fontaine",
				email: "laure.fontaine@example.com",
				daysAgo: 12,
			},

			// Last 2 weeks - recent signups
			{
				firstName: "Marc",
				lastName: "Sanchez",
				email: "marc.sanchez@example.com",
				daysAgo: 10,
			},
			{
				firstName: "Nadia",
				lastName: "Robin",
				email: "nadia.robin@example.com",
				daysAgo: 8,
			},
			{
				firstName: "Oscar",
				lastName: "Vincent",
				email: "oscar.vincent@example.com",
				daysAgo: 7,
			},
			{
				firstName: "Pauline",
				lastName: "Renaud",
				email: "pauline.renaud@example.com",
				daysAgo: 6,
			},
			{
				firstName: "Romain",
				lastName: "Picard",
				email: "romain.picard@example.com",
				daysAgo: 5,
			},
			{
				firstName: "Sophie",
				lastName: "Arnaud",
				email: "sophie.arnaud@example.com",
				daysAgo: 4,
			},
			{
				firstName: "Thomas",
				lastName: "Lemoine",
				email: "thomas.lemoine@example.com",
				daysAgo: 3,
			},
			{
				firstName: "Ursula",
				lastName: "Marchand",
				email: "ursula.marchand@example.com",
				daysAgo: 2,
			},
			{
				firstName: "Victor",
				lastName: "Duval",
				email: "victor.duval@example.com",
				daysAgo: 1,
			},
			{
				firstName: "Wendy",
				lastName: "Leroy",
				email: "wendy.leroy@example.com",
				daysAgo: 0,
			},
		];

		for (const data of userData) {
			const createdAt = now.minus({ days: data.daysAgo });
			const user = await User.create({
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				password: "password123",
				role: "user",
				isActive: true,
				createdAt,
				updatedAt: createdAt,
			});
			users.push(user);
		}

		return users;
	}

	private async createProposals(users: User[]): Promise<Proposal[]> {
		const now = DateTime.now();
		const proposals: Proposal[] = [];

		const proposalTemplates = [
			{
				title: "YouTube Tech Review Partnership",
				description: "Sponsorship opportunity for tech brands",
				projectName: "TechTalk Reviews",
				projectDescription: "Weekly tech reviews with 50K subscribers",
				status: "published" as const,
			},
			{
				title: "Fitness Instagram Collaboration",
				description: "Health and wellness brand partnerships",
				projectName: "FitLife Daily",
				projectDescription: "Daily fitness content with 30K followers",
				status: "published" as const,
			},
			{
				title: "Gaming Twitch Sponsorship",
				description: "Gaming gear and software partnerships",
				projectName: "GameStream Pro",
				projectDescription: "Live gaming streams with 25K viewers",
				status: "published" as const,
			},
			{
				title: "Food Blog Collaboration",
				description: "Restaurant and food brand partnerships",
				projectName: "Gourmet Adventures",
				projectDescription: "Food reviews and recipes",
				status: "draft" as const,
			},
			{
				title: "Travel Vlog Sponsorship",
				description: "Travel gear and tourism partnerships",
				projectName: "Wanderlust Diaries",
				projectDescription: "Travel vlogs from around the world",
				status: "published" as const,
			},
			{
				title: "Fashion Influencer Partnership",
				description: "Clothing and accessory brand deals",
				projectName: "Style Maven",
				projectDescription: "Fashion tips and outfit inspiration",
				status: "published" as const,
			},
			{
				title: "Podcast Advertising Opportunity",
				description: "Audio advertising for various brands",
				projectName: "The Daily Insight",
				projectDescription: "Daily podcast with 100K downloads",
				status: "draft" as const,
			},
			{
				title: "Photography Portfolio Sponsorship",
				description: "Camera and equipment partnerships",
				projectName: "Lens & Light",
				projectDescription: "Professional photography services",
				status: "archived" as const,
			},
			{
				title: "Music Channel Collaboration",
				description: "Music instrument and software brands",
				projectName: "Melody Makers",
				projectDescription: "Music tutorials and performances",
				status: "published" as const,
			},
			{
				title: "DIY & Crafts Partnership",
				description: "Craft supply and tool partnerships",
				projectName: "Creative Corner",
				projectDescription: "DIY tutorials and craft ideas",
				status: "draft" as const,
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

		// Create proposals for users (some users have multiple, some have none)
		for (let i = 0; i < users.length; i++) {
			const user = users[i];
			const userCreatedAt = user.createdAt;

			// 70% of users create at least one proposal
			if (Math.random() > 0.3) {
				const numProposals = Math.random() > 0.7 ? 2 : 1; // 30% create 2 proposals

				for (let j = 0; j < numProposals; j++) {
					const template =
						proposalTemplates[
							Math.floor(Math.random() * proposalTemplates.length)
						];
					const color = colors[Math.floor(Math.random() * colors.length)];

					// Proposal created 1-30 days after user signup
					const daysAfterSignup = Math.floor(Math.random() * 30) + 1;
					const proposalCreatedAt = userCreatedAt.plus({
						days: daysAfterSignup,
					});

					// Don't create proposals in the future
					if (proposalCreatedAt > now) continue;

					const viewCount =
						template.status === "published"
							? Math.floor(Math.random() * 500) + 10
							: 0;

					const proposal = await Proposal.create({
						userId: user.id,
						title: `${template.title} - ${user.fullName.split(" ")[0]}`,
						description: template.description,
						projectName: template.projectName,
						projectDescription: template.projectDescription,
						contactEmail: user.email,
						status: template.status,
						viewCount,
						publishedAt:
							template.status === "published"
								? proposalCreatedAt.plus({ days: 1 })
								: null,
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
		];

		const statuses: Array<
			"new" | "contacted" | "pending" | "converted" | "rejected"
		> = ["new", "contacted", "pending", "converted", "rejected"];

		const messages = [
			"Interested in discussing a potential partnership",
			"Would love to learn more about your sponsorship tiers",
			"Our brand aligns well with your content",
			"Looking for influencer collaborations for Q1",
			"Can we schedule a call to discuss opportunities?",
			"We have a campaign launching next month",
			"Your audience demographics match our target market",
			"Impressed by your engagement rates",
			null,
			null,
		];

		// Only published proposals get leads
		const publishedProposals = proposals.filter(
			(p) => p.status === "published",
		);

		for (const proposal of publishedProposals) {
			// Each published proposal gets 0-8 leads
			const numLeads = Math.floor(Math.random() * 9);

			for (let i = 0; i < numLeads; i++) {
				const firstName =
					firstNames[Math.floor(Math.random() * firstNames.length)];
				const lastName =
					lastNames[Math.floor(Math.random() * lastNames.length)];
				const company = companies[Math.floor(Math.random() * companies.length)];

				// Lead created after proposal was published
				const daysAfterPublish = Math.floor(Math.random() * 60);
				const leadCreatedAt = (proposal.publishedAt || proposal.createdAt).plus(
					{
						days: daysAfterPublish,
					},
				);

				// Don't create leads in the future
				if (leadCreatedAt > now) continue;

				// Status distribution: new (40%), contacted (25%), pending (15%), converted (10%), rejected (10%)
				const statusRand = Math.random();
				let status: (typeof statuses)[number];
				if (statusRand < 0.4) status = "new";
				else if (statusRand < 0.65) status = "contacted";
				else if (statusRand < 0.8) status = "pending";
				else if (statusRand < 0.9) status = "converted";
				else status = "rejected";

				const lead = await Lead.create({
					proposalId: proposal.id,
					name: `${firstName} ${lastName}`,
					email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/\s+/g, "")}.com`,
					company,
					phone:
						Math.random() > 0.5
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
}
