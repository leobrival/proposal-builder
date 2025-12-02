import { Head, router, useForm } from "@inertiajs/react";
import {
	Calendar,
	ExternalLink,
	Globe,
	Link2,
	Loader2,
	MapPin,
	Sparkles,
	Tag,
	User,
} from "lucide-react";
import { type FormEvent, useState } from "react";

/**
 * Get XSRF token from cookies for CSRF protection
 */
function getXsrfToken(): string | null {
	const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
	if (match) {
		return decodeURIComponent(match[1]);
	}
	return null;
}

import AppLayout from "../../components/layouts/app-layout";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import { Textarea } from "../../components/ui/textarea";

interface ImportedEventData {
	title: string;
	description: string | null;
	projectName: string;
	projectDescription: string | null;
	coverImageUrl: string | null;
	eventStartDate: string | null;
	eventEndDate: string | null;
	eventVenueName: string | null;
	eventAddress: string | null;
	eventCity: string | null;
	eventCountry: string | null;
	eventLatitude: number | null;
	eventLongitude: number | null;
	eventCategory: string | null;
	eventTags: string[];
	eventSourceUrl: string;
	eventSourcePlatform: string;
	eventExternalId: string | null;
	organizerName: string | null;
	organizerWebsite: string | null;
	eventFormat: "in_person" | "online" | "hybrid" | null;
	eventExpectedAttendees: number | null;
	suggestedTierPrice: number | null;
	suggestedTierCurrency: string;
}

export default function CreateProposal() {
	const [importUrl, setImportUrl] = useState("");
	const [isImporting, setIsImporting] = useState(false);
	const [importError, setImportError] = useState<string | null>(null);
	const [importedData, setImportedData] = useState<ImportedEventData | null>(
		null,
	);

	const { data, setData, post, processing, errors } = useForm({
		title: "",
		projectName: "",
		description: "",
		projectDescription: "",
		contactEmail: "",
		contactPhone: "",
		// Event fields
		eventStartDate: "",
		eventEndDate: "",
		eventVenueName: "",
		eventAddress: "",
		eventCity: "",
		eventCountry: "",
		eventLatitude: null as number | null,
		eventLongitude: null as number | null,
		eventCategory: "",
		eventTags: [] as string[],
		eventSourceUrl: "",
		eventSourcePlatform: "",
		eventExternalId: "",
		organizerName: "",
		organizerWebsite: "",
		eventFormat: "" as "" | "in_person" | "online" | "hybrid",
		eventExpectedAttendees: null as number | null,
		coverImageUrl: "",
	});

	const handleImport = async () => {
		if (!importUrl.trim()) {
			setImportError("Please enter an event URL");
			return;
		}

		setIsImporting(true);
		setImportError(null);

		try {
			const xsrfToken = getXsrfToken();
			const headers: Record<string, string> = {
				"Content-Type": "application/json",
				Accept: "application/json",
			};
			if (xsrfToken) {
				headers["X-XSRF-TOKEN"] = xsrfToken;
			}

			const response = await fetch("/api/events/preview", {
				method: "POST",
				headers,
				credentials: "same-origin",
				body: JSON.stringify({ url: importUrl }),
			});

			// Check if response is JSON
			const contentType = response.headers.get("content-type");
			if (!contentType || !contentType.includes("application/json")) {
				const text = await response.text();
				console.error("Non-JSON response:", text.substring(0, 500));
				setImportError(
					`Server error (${response.status}): Expected JSON response`,
				);
				return;
			}

			const result = await response.json();

			if (!response.ok || !result.success) {
				setImportError(
					result.error || `Failed to import event (${response.status})`,
				);
				return;
			}

			const eventData = result.data as ImportedEventData;
			setImportedData(eventData);

			// Auto-fill form with imported data
			setData({
				...data,
				title: eventData.title || "",
				projectName: eventData.projectName || eventData.title || "",
				description: eventData.description || "",
				projectDescription: eventData.projectDescription || "",
				eventStartDate: eventData.eventStartDate || "",
				eventEndDate: eventData.eventEndDate || "",
				eventVenueName: eventData.eventVenueName || "",
				eventAddress: eventData.eventAddress || "",
				eventCity: eventData.eventCity || "",
				eventCountry: eventData.eventCountry || "",
				eventLatitude: eventData.eventLatitude,
				eventLongitude: eventData.eventLongitude,
				eventCategory: eventData.eventCategory || "",
				eventTags: eventData.eventTags || [],
				eventSourceUrl: eventData.eventSourceUrl || "",
				eventSourcePlatform: eventData.eventSourcePlatform || "",
				eventExternalId: eventData.eventExternalId || "",
				organizerName: eventData.organizerName || "",
				organizerWebsite: eventData.organizerWebsite || "",
				eventFormat: eventData.eventFormat || "",
				eventExpectedAttendees: eventData.eventExpectedAttendees,
				coverImageUrl: eventData.coverImageUrl || "",
			});
		} catch (error) {
			setImportError(
				error instanceof Error ? error.message : "Failed to import event",
			);
		} finally {
			setIsImporting(false);
		}
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		post("/proposals");
	};

	const formatDate = (dateStr: string | null) => {
		if (!dateStr) return null;
		try {
			return new Date(dateStr).toLocaleDateString("fr-FR", {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			});
		} catch {
			return dateStr;
		}
	};

	const formatEventFormat = (format: string | null) => {
		switch (format) {
			case "in_person":
				return "En personne";
			case "online":
				return "En ligne";
			case "hybrid":
				return "Hybride";
			default:
				return null;
		}
	};

	return (
		<AppLayout>
			<Head title="Nouvelle proposition" />
			<div className="max-w-4xl mx-auto">
				<h1 className="text-2xl font-bold mb-6">Nouvelle proposition</h1>

				{/* Event Import Section */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Sparkles className="h-5 w-5 text-primary" />
							Importer depuis un event
						</CardTitle>
						<CardDescription>
							Collez le lien d'un event Eventbrite, Meetup ou Facebook pour
							remplir automatiquement les informations
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex gap-3">
							<div className="flex-1">
								<Input
									placeholder="https://www.eventbrite.fr/e/mon-event-123456789"
									value={importUrl}
									onChange={(e) => setImportUrl(e.target.value)}
									disabled={isImporting}
								/>
							</div>
							<Button
								type="button"
								onClick={handleImport}
								disabled={isImporting || !importUrl.trim()}
							>
								{isImporting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Import...
									</>
								) : (
									<>
										<Link2 className="mr-2 h-4 w-4" />
										Importer
									</>
								)}
							</Button>
						</div>

						{importError && (
							<p className="mt-2 text-sm text-destructive">{importError}</p>
						)}

						{/* Import Preview */}
						{importedData && (
							<div className="mt-4 p-4 bg-muted/50 rounded-lg border">
								<div className="flex items-start gap-4">
									{importedData.coverImageUrl && (
										<img
											src={importedData.coverImageUrl}
											alt={importedData.title}
											className="w-24 h-24 object-cover rounded-lg"
										/>
									)}
									<div className="flex-1 space-y-2">
										<div className="flex items-center gap-2">
											<Badge variant="secondary" className="text-xs">
												{importedData.eventSourcePlatform}
											</Badge>
											{importedData.eventFormat && (
												<Badge variant="outline" className="text-xs">
													{formatEventFormat(importedData.eventFormat)}
												</Badge>
											)}
										</div>
										<h3 className="font-semibold">{importedData.title}</h3>

										{importedData.eventStartDate && (
											<p className="text-sm text-muted-foreground flex items-center gap-1">
												<Calendar className="h-3.5 w-3.5" />
												{formatDate(importedData.eventStartDate)}
											</p>
										)}

										{(importedData.eventVenueName ||
											importedData.eventCity) && (
											<p className="text-sm text-muted-foreground flex items-center gap-1">
												<MapPin className="h-3.5 w-3.5" />
												{[
													importedData.eventVenueName,
													importedData.eventCity,
													importedData.eventCountry,
												]
													.filter(Boolean)
													.join(", ")}
											</p>
										)}

										{importedData.organizerName && (
											<p className="text-sm text-muted-foreground flex items-center gap-1">
												<User className="h-3.5 w-3.5" />
												{importedData.organizerName}
											</p>
										)}

										{importedData.eventTags.length > 0 && (
											<div className="flex flex-wrap gap-1 mt-2">
												{importedData.eventTags.slice(0, 5).map((tag) => (
													<Badge
														key={tag}
														variant="outline"
														className="text-xs"
													>
														<Tag className="h-2.5 w-2.5 mr-1" />
														{tag}
													</Badge>
												))}
												{importedData.eventTags.length > 5 && (
													<Badge variant="outline" className="text-xs">
														+{importedData.eventTags.length - 5}
													</Badge>
												)}
											</div>
										)}

										{importedData.suggestedTierPrice && (
											<p className="text-sm font-medium text-primary">
												Prix suggere:{" "}
												{new Intl.NumberFormat("fr-FR", {
													style: "currency",
													currency: importedData.suggestedTierCurrency,
												}).format(importedData.suggestedTierPrice)}
											</p>
										)}
									</div>
								</div>
								<p className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
									<ExternalLink className="h-3 w-3" />
									Les donnees ont ete importees. Vous pouvez les modifier
									ci-dessous.
								</p>
							</div>
						)}
					</CardContent>
				</Card>

				<Separator className="my-6" />

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-4">
						<h2 className="text-lg font-semibold">Informations de base</h2>

						<div className="space-y-2">
							<Label htmlFor="title">Titre de la proposition *</Label>
							<Input
								id="title"
								value={data.title}
								onChange={(e) => setData("title", e.target.value)}
								placeholder="Ex: Sponsoring Festival 2024"
								required
							/>
							{errors.title && (
								<p className="text-sm text-destructive">{errors.title}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="projectName">Nom du projet *</Label>
							<Input
								id="projectName"
								value={data.projectName}
								onChange={(e) => setData("projectName", e.target.value)}
								placeholder="Ex: Festival de Musique"
								required
							/>
							{errors.projectName && (
								<p className="text-sm text-destructive">{errors.projectName}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">
								Description de la proposition (optionnel)
							</Label>
							<Textarea
								id="description"
								value={data.description}
								onChange={(e) => setData("description", e.target.value)}
								placeholder="Decrivez votre proposition de sponsoring..."
								rows={3}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="projectDescription">
								Description du projet (optionnel)
							</Label>
							<Textarea
								id="projectDescription"
								value={data.projectDescription}
								onChange={(e) => setData("projectDescription", e.target.value)}
								placeholder="Decrivez votre projet en detail..."
								rows={4}
							/>
						</div>
					</div>

					{/* Event Details Section - only show if imported or user wants to add */}
					{(importedData || data.eventSourceUrl) && (
						<div className="space-y-4">
							<h2 className="text-lg font-semibold flex items-center gap-2">
								<Calendar className="h-5 w-5" />
								Details de l'evenement
							</h2>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="eventStartDate">Date de debut</Label>
									<Input
										id="eventStartDate"
										type="datetime-local"
										value={
											data.eventStartDate
												? new Date(data.eventStartDate)
														.toISOString()
														.slice(0, 16)
												: ""
										}
										onChange={(e) =>
											setData(
												"eventStartDate",
												e.target.value
													? new Date(e.target.value).toISOString()
													: "",
											)
										}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="eventEndDate">Date de fin</Label>
									<Input
										id="eventEndDate"
										type="datetime-local"
										value={
											data.eventEndDate
												? new Date(data.eventEndDate).toISOString().slice(0, 16)
												: ""
										}
										onChange={(e) =>
											setData(
												"eventEndDate",
												e.target.value
													? new Date(e.target.value).toISOString()
													: "",
											)
										}
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="eventVenueName">Nom du lieu</Label>
								<Input
									id="eventVenueName"
									value={data.eventVenueName}
									onChange={(e) => setData("eventVenueName", e.target.value)}
									placeholder="Ex: Palais des Congres"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="eventAddress">Adresse</Label>
								<Input
									id="eventAddress"
									value={data.eventAddress}
									onChange={(e) => setData("eventAddress", e.target.value)}
									placeholder="Ex: 2 Place de la Porte Maillot, 75017 Paris"
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="eventCity">Ville</Label>
									<Input
										id="eventCity"
										value={data.eventCity}
										onChange={(e) => setData("eventCity", e.target.value)}
										placeholder="Ex: Paris"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="eventCountry">Pays</Label>
									<Input
										id="eventCountry"
										value={data.eventCountry}
										onChange={(e) => setData("eventCountry", e.target.value)}
										placeholder="Ex: France"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="organizerName">Nom de l'organisateur</Label>
								<Input
									id="organizerName"
									value={data.organizerName}
									onChange={(e) => setData("organizerName", e.target.value)}
									placeholder="Ex: Association Culturelle"
								/>
							</div>

							{data.eventSourceUrl && (
								<div className="p-3 bg-muted/50 rounded-lg text-sm">
									<p className="flex items-center gap-2 text-muted-foreground">
										<Globe className="h-4 w-4" />
										Source:{" "}
										<a
											href={data.eventSourceUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="text-primary hover:underline"
										>
											{data.eventSourcePlatform || "External"}
										</a>
									</p>
								</div>
							)}
						</div>
					)}

					<div className="space-y-4">
						<h2 className="text-lg font-semibold">Contact</h2>

						<div className="space-y-2">
							<Label htmlFor="contactEmail">Email de contact *</Label>
							<Input
								id="contactEmail"
								type="email"
								value={data.contactEmail}
								onChange={(e) => setData("contactEmail", e.target.value)}
								placeholder="contact@example.com"
								required
							/>
							{errors.contactEmail && (
								<p className="text-sm text-destructive">
									{errors.contactEmail}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="contactPhone">Telephone (optionnel)</Label>
							<Input
								id="contactPhone"
								type="tel"
								value={data.contactPhone}
								onChange={(e) => setData("contactPhone", e.target.value)}
								placeholder="+33 6 12 34 56 78"
							/>
						</div>
					</div>

					<div className="flex gap-4">
						<Button type="submit" disabled={processing}>
							{processing ? "Creation..." : "Creer et personnaliser"}
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => router.visit("/dashboard")}
						>
							Annuler
						</Button>
					</div>
				</form>
			</div>
		</AppLayout>
	);
}
