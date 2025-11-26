import { Head, Link, useForm } from "@inertiajs/react";
import type { FormEvent } from "react";
import GuestLayout from "../../components/layouts/guest-layout";
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
import { PasswordInput } from "../../components/ui/password-input";

export default function Register() {
	const { data, setData, post, processing, errors } = useForm({
		fullName: "",
		email: "",
		password: "",
	});

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		post("/register");
	};

	return (
		<GuestLayout>
			<Head title="Inscription" />
			<div className="w-full max-w-md">
				<Card>
					<CardHeader className="text-center">
						<CardTitle className="text-2xl">Inscription</CardTitle>
						<CardDescription>
							Créez votre compte Sponseasy gratuitement
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="fullName">Nom complet</Label>
								<Input
									id="fullName"
									type="text"
									value={data.fullName}
									onChange={(e) => setData("fullName", e.target.value)}
									placeholder="Jean Dupont"
									required
								/>
								{errors.fullName && (
									<p className="text-sm text-destructive">{errors.fullName}</p>
								)}
							</div>
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									value={data.email}
									onChange={(e) => setData("email", e.target.value)}
									placeholder="votre@email.com"
									required
								/>
								{errors.email && (
									<p className="text-sm text-destructive">{errors.email}</p>
								)}
							</div>
							<div className="space-y-2">
								<Label htmlFor="password">Mot de passe</Label>
								<PasswordInput
									id="password"
									value={data.password}
									onChange={(e) => setData("password", e.target.value)}
									required
									minLength={8}
								/>
								{errors.password && (
									<p className="text-sm text-destructive">{errors.password}</p>
								)}
								<p className="text-xs text-muted-foreground">
									Minimum 8 caractères
								</p>
							</div>
							<Button type="submit" disabled={processing} className="w-full">
								{processing ? "Inscription..." : "S'inscrire"}
							</Button>
						</form>
						<p className="text-center text-sm text-muted-foreground mt-4">
							Déjà un compte ?{" "}
							<Link href="/login" className="text-primary hover:underline">
								Se connecter
							</Link>
						</p>
					</CardContent>
				</Card>
			</div>
		</GuestLayout>
	);
}
