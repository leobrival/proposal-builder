import { Head, useForm } from "@inertiajs/react";
import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

interface LandingProps {
	waitlistCount: number;
}

export default function Landing({ waitlistCount }: LandingProps) {
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const [submitMessage, setSubmitMessage] = useState("");

	const { data, setData, post, processing, errors, reset } = useForm({
		email: "",
		creatorType: "",
	});

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		post("/waitlist", {
			onSuccess: () => {
				setSubmitSuccess(true);
				setSubmitMessage("Bienvenue sur la liste d'attente !");
				reset();
			},
			onError: () => {
				setSubmitMessage("Une erreur est survenue. Veuillez réessayer.");
			},
		});
	};

	const scrollToWaitlist = () => {
		document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<>
			<Head title="Spons Easy - Proposals de Sponsoring Professionnelles" />

			<div className="min-h-screen bg-background">
				{/* Hero Section */}
				<section className="relative px-4 py-16 md:py-24 lg:py-32">
					<div className="mx-auto max-w-6xl">
						<div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
							<div className="space-y-8">
								<div className="space-y-4">
									<h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-foreground">
										Create Sponsorship Proposals That Get Brands to Say Yes
									</h1>
									<p className="text-xl text-muted-foreground">
										Stop leaving money on the table. Build professional
										proposals in 5 minutes with our live builder - no sales
										experience needed.
									</p>
								</div>
								<div className="space-y-4">
									<Button
										size="lg"
										className="text-lg px-8 py-6"
										onClick={scrollToWaitlist}
									>
										Get Early Access
									</Button>
									<p className="text-sm text-muted-foreground">
										Free during beta. No credit card required.
									</p>
								</div>
								<p className="text-sm font-medium text-primary">
									Join {waitlistCount > 0 ? waitlistCount : 127}+ creators
									already on the waitlist
								</p>
							</div>
							<div className="relative">
								<div className="rounded-lg border bg-card p-4 shadow-2xl">
									<div className="aspect-video rounded bg-muted flex items-center justify-center">
										<div className="text-center space-y-2">
											<div className="text-4xl">📝</div>
											<p className="text-muted-foreground text-sm">
												Live Builder Preview
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Social Proof Bar */}
				<section className="bg-muted py-8">
					<div className="mx-auto max-w-6xl px-4">
						<div className="grid grid-cols-3 gap-8 text-center">
							<div>
								<div className="text-3xl font-bold text-foreground">
									{waitlistCount > 0 ? waitlistCount : 127}+
								</div>
								<div className="text-sm text-muted-foreground">
									Creators on waitlist
								</div>
							</div>
							<div>
								<div className="text-3xl font-bold text-foreground">3 min</div>
								<div className="text-sm text-muted-foreground">
									Average first proposal
								</div>
							</div>
							<div>
								<div className="text-3xl font-bold text-foreground">89%</div>
								<div className="text-sm text-muted-foreground">
									"I wish I had this sooner"
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Problem Section */}
				<section className="py-16 md:py-24 px-4">
					<div className="mx-auto max-w-6xl">
						<h2 className="text-3xl font-bold text-center mb-12 text-foreground">
							Sound Familiar?
						</h2>
						<div className="grid gap-6 md:grid-cols-2">
							<div className="rounded-lg border bg-card p-6 space-y-3">
								<div className="text-2xl">😔</div>
								<h3 className="font-semibold text-foreground">
									You watch smaller creators land brand deals
								</h3>
								<p className="text-muted-foreground">
									They must know something you don't. Every time you see a
									creator with fewer followers announce a sponsorship, you
									wonder what you're doing wrong.
								</p>
							</div>
							<div className="rounded-lg border bg-card p-6 space-y-3">
								<div className="text-2xl">📭</div>
								<h3 className="font-semibold text-foreground">
									Your outreach gets ignored
								</h3>
								<p className="text-muted-foreground">
									You've DM'd brands on Instagram, sent emails, tried templates
									from YouTube. Nothing works. Your messages disappear into the
									void.
								</p>
							</div>
							<div className="rounded-lg border bg-card p-6 space-y-3">
								<div className="text-2xl">😰</div>
								<h3 className="font-semibold text-foreground">
									You don't know what to charge
								</h3>
								<p className="text-muted-foreground">
									When a brand finally responds, panic sets in. You lowball
									yourself, undervalue your work, or ask for so much they ghost
									you.
								</p>
							</div>
							<div className="rounded-lg border bg-card p-6 space-y-3">
								<div className="text-2xl">😓</div>
								<h3 className="font-semibold text-foreground">
									Your "media kit" is embarrassing
								</h3>
								<p className="text-muted-foreground">
									A messy Google Doc with screenshots of your stats. You know it
									looks amateur compared to bigger creators, but you don't know
									how to make it better.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Solution Section */}
				<section className="py-16 md:py-24 px-4 bg-muted/50">
					<div className="mx-auto max-w-6xl">
						<div className="text-center mb-12">
							<h2 className="text-3xl font-bold text-foreground">
								There's a Better Way
							</h2>
							<p className="mt-4 text-xl text-muted-foreground">
								Spons Easy transforms how you approach sponsorships. No sales
								skills required.
							</p>
						</div>
						<div className="space-y-6">
							<div className="flex gap-4 items-start p-6 rounded-lg bg-card border">
								<div className="text-primary text-2xl">✓</div>
								<div>
									<h3 className="font-semibold text-foreground">
										Look as professional as creators 10x your size
									</h3>
									<p className="text-muted-foreground mt-1">
										Our templates are designed by sponsorship experts who've
										closed millions in brand deals. Your proposals will rival
										those of creators with dedicated managers.
									</p>
								</div>
							</div>
							<div className="flex gap-4 items-start p-6 rounded-lg bg-card border">
								<div className="text-primary text-2xl">✓</div>
								<div>
									<h3 className="font-semibold text-foreground">
										Know exactly what to charge
									</h3>
									<p className="text-muted-foreground mt-1">
										Our pricing calculator uses real market data to suggest
										rates based on your niche, audience size, and engagement. No
										more guessing.
									</p>
								</div>
							</div>
							<div className="flex gap-4 items-start p-6 rounded-lg bg-card border">
								<div className="text-primary text-2xl">✓</div>
								<div>
									<h3 className="font-semibold text-foreground">
										Get responses, not silence
									</h3>
									<p className="text-muted-foreground mt-1">
										Proposals built with Spons Easy include proven psychological
										triggers that get brands to respond. Our beta users report
										3x higher response rates.
									</p>
								</div>
							</div>
							<div className="flex gap-4 items-start p-6 rounded-lg bg-card border">
								<div className="text-primary text-2xl">✓</div>
								<div>
									<h3 className="font-semibold text-foreground">
										Create proposals in minutes, not days
									</h3>
									<p className="text-muted-foreground mt-1">
										The live builder guides you through every section. See your
										proposal take shape in real-time. Your first professional
										proposal in under 5 minutes.
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* How It Works */}
				<section className="py-16 md:py-24 px-4">
					<div className="mx-auto max-w-6xl">
						<h2 className="text-3xl font-bold text-center mb-12 text-foreground">
							Your First Proposal in 3 Simple Steps
						</h2>
						<div className="grid gap-8 md:grid-cols-3">
							<div className="text-center space-y-4">
								<div className="mx-auto w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
									1
								</div>
								<h3 className="font-semibold text-foreground text-xl">
									Answer a Few Questions
								</h3>
								<p className="text-muted-foreground">
									Tell us about your content, your audience, and the brands you
									want to work with. Our guided form takes less than 3 minutes.
								</p>
							</div>
							<div className="text-center space-y-4">
								<div className="mx-auto w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
									2
								</div>
								<h3 className="font-semibold text-foreground text-xl">
									Watch Your Proposal Come to Life
								</h3>
								<p className="text-muted-foreground">
									Our live builder creates your professional sponsorship deck in
									real-time. See exactly how brands will see you.
								</p>
							</div>
							<div className="text-center space-y-4">
								<div className="mx-auto w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
									3
								</div>
								<h3 className="font-semibold text-foreground text-xl">
									Publish and Share
								</h3>
								<p className="text-muted-foreground">
									Get a beautiful, shareable link to send to brands. Track who
									views your proposal and receive inquiries directly.
								</p>
							</div>
						</div>
						<div className="text-center mt-12">
							<Button size="lg" onClick={scrollToWaitlist}>
								Get Early Access
							</Button>
							<p className="mt-2 text-sm text-muted-foreground">
								Ready to create yours?
							</p>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section className="py-16 md:py-24 px-4 bg-muted/50">
					<div className="mx-auto max-w-6xl">
						<h2 className="text-3xl font-bold text-center mb-12 text-foreground">
							Everything You Need to Land Sponsorships
						</h2>
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							<div className="rounded-lg border bg-card p-6 space-y-3">
								<div className="text-3xl">🎨</div>
								<h3 className="font-semibold text-foreground">
									Live Proposal Builder
								</h3>
								<p className="text-muted-foreground text-sm">
									See your sponsorship deck take shape in real-time. Our
									split-screen interface shows your form inputs instantly
									reflected in a beautiful preview.
								</p>
							</div>
							<div className="rounded-lg border bg-card p-6 space-y-3">
								<div className="text-3xl">📄</div>
								<h3 className="font-semibold text-foreground">
									Professional Templates
								</h3>
								<p className="text-muted-foreground text-sm">
									Choose from templates designed by sponsorship experts. Each
									template is optimized for different niches - tech, lifestyle,
									gaming, fitness, and more.
								</p>
							</div>
							<div className="rounded-lg border bg-card p-6 space-y-3">
								<div className="text-3xl">💰</div>
								<h3 className="font-semibold text-foreground">
									Smart Pricing Calculator
								</h3>
								<p className="text-muted-foreground text-sm">
									Stop undervaluing your work. Our calculator suggests rates
									based on real market data, your niche, audience size, and
									engagement metrics.
								</p>
							</div>
							<div className="rounded-lg border bg-card p-6 space-y-3">
								<div className="text-3xl">🚀</div>
								<h3 className="font-semibold text-foreground">
									One-Click Publishing
								</h3>
								<p className="text-muted-foreground text-sm">
									Publish your proposal as a beautiful, mobile-friendly website
									with a single click. Get a shareable link to send to brands
									instantly.
								</p>
							</div>
							<div className="rounded-lg border bg-card p-6 space-y-3">
								<div className="text-3xl">📬</div>
								<h3 className="font-semibold text-foreground">
									Built-in Contact Form
								</h3>
								<p className="text-muted-foreground text-sm">
									Brands can express interest directly through your proposal.
									Receive notifications when sponsors reach out. Never miss an
									opportunity.
								</p>
							</div>
							<div className="rounded-lg border bg-card p-6 space-y-3">
								<div className="text-3xl">📥</div>
								<h3 className="font-semibold text-foreground">PDF Export</h3>
								<p className="text-muted-foreground text-sm">
									Need to attach your proposal to an email? Export a
									professionally formatted PDF that matches your online proposal
									perfectly.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Testimonials */}
				<section className="py-16 md:py-24 px-4">
					<div className="mx-auto max-w-6xl">
						<h2 className="text-3xl font-bold text-center mb-12 text-foreground">
							Creators Like You Are Already Seeing Results
						</h2>
						<div className="grid gap-6 md:grid-cols-2">
							<div className="rounded-lg border bg-card p-6 space-y-4">
								<p className="text-muted-foreground italic">
									"I spent months trying to land my first sponsorship. With
									Spons Easy, I created a proposal in my lunch break and got a
									response from a brand the same week. I'm still shocked."
								</p>
								<div>
									<p className="font-semibold text-foreground">Clara M.</p>
									<p className="text-sm text-muted-foreground">
										Lifestyle Creator, 45K followers
									</p>
								</div>
							</div>
							<div className="rounded-lg border bg-card p-6 space-y-4">
								<p className="text-muted-foreground italic">
									"The pricing calculator alone is worth it. I was charging €200
									for posts worth €800. Now I have the data to back up my
									rates."
								</p>
								<div>
									<p className="font-semibold text-foreground">Thomas R.</p>
									<p className="text-sm text-muted-foreground">
										Tech Reviewer, 28K subscribers
									</p>
								</div>
							</div>
							<div className="rounded-lg border bg-card p-6 space-y-4">
								<p className="text-muted-foreground italic">
									"As someone who runs a small sports club, I never knew how to
									approach sponsors without feeling like I was begging. Spons
									Easy made it feel like a professional business conversation."
								</p>
								<div>
									<p className="font-semibold text-foreground">Marie L.</p>
									<p className="text-sm text-muted-foreground">
										Club President, Tennis Association
									</p>
								</div>
							</div>
							<div className="rounded-lg border bg-card p-6 space-y-4">
								<p className="text-muted-foreground italic">
									"I've tried Canva templates, copied formats from YouTube, even
									hired a designer once. Nothing looked as professional as what
									I made in 10 minutes with Spons Easy."
								</p>
								<div>
									<p className="font-semibold text-foreground">Lucas D.</p>
									<p className="text-sm text-muted-foreground">
										Gaming Streamer, 72K followers
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Waitlist CTA Section */}
				<section
					id="waitlist"
					className="py-16 md:py-24 px-4 bg-primary text-primary-foreground"
				>
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="text-3xl font-bold mb-4">
							Ready to Land Your First Brand Deal?
						</h2>
						<p className="text-xl opacity-90 mb-8">
							Join the beta and create your first professional sponsorship
							proposal for free.
						</p>

						{submitSuccess ? (
							<div className="rounded-lg bg-white/10 p-8 space-y-4">
								<div className="text-4xl">🎉</div>
								<p className="text-xl font-semibold">{submitMessage}</p>
								<p className="opacity-90">
									We'll notify you when Spons Easy launches.
								</p>
							</div>
						) : (
							<form onSubmit={handleSubmit} className="space-y-4">
								<div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
									<Input
										type="email"
										placeholder="votre@email.com"
										value={data.email}
										onChange={(e) => setData("email", e.target.value)}
										className="bg-white text-foreground"
										required
									/>
									<Button
										type="submit"
										variant="secondary"
										disabled={processing}
										className="whitespace-nowrap"
									>
										{processing ? "..." : "Get Early Access"}
									</Button>
								</div>
								{errors.email && (
									<p className="text-sm text-red-200">{errors.email}</p>
								)}
								<div className="max-w-md mx-auto">
									<select
										value={data.creatorType}
										onChange={(e) => setData("creatorType", e.target.value)}
										className="w-full rounded-md border bg-white text-foreground px-3 py-2 text-sm"
									>
										<option value="">I am a... (optional)</option>
										<option value="creator">Content Creator</option>
										<option value="event">Event Organizer</option>
										<option value="association">Association / Club</option>
										<option value="other">Other</option>
									</select>
								</div>
							</form>
						)}

						<p className="mt-6 text-sm opacity-75">
							{waitlistCount > 0 ? waitlistCount : 127} creators already
							waiting. Beta launching January 2025.
						</p>

						<div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
							<span className="flex items-center gap-2">
								<span>✓</span> Free during beta
							</span>
							<span className="flex items-center gap-2">
								<span>✓</span> First proposal in under 5 min
							</span>
							<span className="flex items-center gap-2">
								<span>✓</span> Be among the first
							</span>
						</div>
					</div>
				</section>

				{/* FAQ Section */}
				<section className="py-16 md:py-24 px-4">
					<div className="mx-auto max-w-3xl">
						<h2 className="text-3xl font-bold text-center mb-12 text-foreground">
							Frequently Asked Questions
						</h2>
						<div className="space-y-4">
							<details className="rounded-lg border bg-card p-4 group">
								<summary className="font-semibold cursor-pointer text-foreground">
									Is Spons Easy really free during beta?
								</summary>
								<p className="mt-3 text-muted-foreground">
									Yes, completely free. We're looking for early users to help
									shape the product. You'll get full access to all features
									during beta at no cost. No credit card required to sign up.
								</p>
							</details>
							<details className="rounded-lg border bg-card p-4 group">
								<summary className="font-semibold cursor-pointer text-foreground">
									Who is Spons Easy for?
								</summary>
								<p className="mt-3 text-muted-foreground">
									Spons Easy is designed for anyone seeking sponsorships:
									content creators (YouTubers, streamers, podcasters,
									influencers), event organizers, and associations/clubs. If you
									need to create professional sponsorship proposals, we built
									this for you.
								</p>
							</details>
							<details className="rounded-lg border bg-card p-4 group">
								<summary className="font-semibold cursor-pointer text-foreground">
									How long does it take to create a proposal?
								</summary>
								<p className="mt-3 text-muted-foreground">
									Most users complete their first proposal in under 5 minutes.
									Our guided form and live preview make it easy to see exactly
									what you're building as you go.
								</p>
							</details>
							<details className="rounded-lg border bg-card p-4 group">
								<summary className="font-semibold cursor-pointer text-foreground">
									Do I need sales or design experience?
								</summary>
								<p className="mt-3 text-muted-foreground">
									Not at all. Our templates and guided process handle the design
									and structure. You just fill in the information about your
									content, audience, and what you're offering sponsors.
								</p>
							</details>
							<details className="rounded-lg border bg-card p-4 group">
								<summary className="font-semibold cursor-pointer text-foreground">
									Can I customize my proposal's design?
								</summary>
								<p className="mt-3 text-muted-foreground">
									Yes. You can customize colors, fonts, and layout to match your
									brand. The live preview shows your changes in real-time.
								</p>
							</details>
							<details className="rounded-lg border bg-card p-4 group">
								<summary className="font-semibold cursor-pointer text-foreground">
									How do I share my proposal with brands?
								</summary>
								<p className="mt-3 text-muted-foreground">
									When you publish your proposal, you get a unique link you can
									share via email, DM, or anywhere else. Brands can view your
									proposal online and contact you directly through a built-in
									contact form.
								</p>
							</details>
							<details className="rounded-lg border bg-card p-4 group">
								<summary className="font-semibold cursor-pointer text-foreground">
									What happens when the beta ends?
								</summary>
								<p className="mt-3 text-muted-foreground">
									Beta users will get early access to our launch pricing and
									special perks as a thank you for helping us build a better
									product. We'll communicate any changes well in advance.
								</p>
							</details>
							<details className="rounded-lg border bg-card p-4 group">
								<summary className="font-semibold cursor-pointer text-foreground">
									What if I have more questions?
								</summary>
								<p className="mt-3 text-muted-foreground">
									Email us at hello@sponseasy.com - we read and respond to every
									message personally.
								</p>
							</details>
						</div>
					</div>
				</section>

				{/* Final CTA */}
				<section className="py-16 md:py-24 px-4 bg-muted">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="text-3xl font-bold text-foreground mb-4">
							Your First Sponsorship Is Closer Than You Think
						</h2>
						<p className="text-xl text-muted-foreground mb-8">
							Don't let another brand deal pass you by. Join the beta and create
							your first professional proposal today.
						</p>
						<Button
							size="lg"
							className="text-lg px-8"
							onClick={scrollToWaitlist}
						>
							Get Early Access Now
						</Button>
						<p className="mt-4 text-sm text-muted-foreground">
							Beta spots are limited. {waitlistCount > 0 ? waitlistCount : 127}{" "}
							creators already waiting.
						</p>
					</div>
				</section>

				{/* Footer */}
				<footer className="py-8 px-4 bg-foreground text-background">
					<div className="mx-auto max-w-6xl">
						<div className="text-center space-y-4">
							<div className="text-xl font-bold">Spons Easy</div>
							<p className="text-sm opacity-75">
								Professional sponsorship proposals for creators, events, and
								associations.
							</p>
							<div className="flex justify-center gap-6 text-sm">
								<span className="opacity-75 hover:opacity-100 cursor-pointer">
									Privacy Policy
								</span>
								<span className="opacity-75 hover:opacity-100 cursor-pointer">
									Terms of Service
								</span>
								<a
									href="mailto:hello@sponseasy.com"
									className="opacity-75 hover:opacity-100"
								>
									Contact Us
								</a>
							</div>
							<p className="text-xs opacity-50">
								© 2025 Spons Easy. All rights reserved.
							</p>
						</div>
					</div>
				</footer>
			</div>
		</>
	);
}
