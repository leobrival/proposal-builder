import { Head, router, useForm } from "@inertiajs/react";
import type { FormEvent } from "react";
import AppLayout from "../../components/layouts/app-layout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";

export default function CreateProposal() {
	const { data, setData, post, processing, errors } = useForm({
		title: "",
		projectName: "",
		description: "",
		projectDescription: "",
		contactEmail: "",
		contactPhone: "",
	});

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		post("/proposals");
	};

	return (
		<AppLayout>
			<Head title="Nouvelle proposition" />
			<div className="max-w-2xl mx-auto">
				<h1 className="text-2xl font-bold mb-6">Nouvelle proposition</h1>

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
								placeholder="Décrivez votre proposition de sponsoring..."
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
								placeholder="Décrivez votre projet en détail..."
								rows={4}
							/>
						</div>
					</div>

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
							<Label htmlFor="contactPhone">Téléphone (optionnel)</Label>
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
							{processing ? "Création..." : "Créer et personnaliser"}
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
