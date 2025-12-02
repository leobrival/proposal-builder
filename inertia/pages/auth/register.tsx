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
		firstName: "",
		lastName: "",
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
							Creez votre compte Sponseasy gratuitement
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="firstName">Prenom</Label>
									<Input
										id="firstName"
										type="text"
										value={data.firstName}
										onChange={(e) => setData("firstName", e.target.value)}
										placeholder="Jean"
										required
									/>
									{errors.firstName && (
										<p className="text-sm text-destructive">
											{errors.firstName}
										</p>
									)}
								</div>
								<div className="space-y-2">
									<Label htmlFor="lastName">Nom</Label>
									<Input
										id="lastName"
										type="text"
										value={data.lastName}
										onChange={(e) => setData("lastName", e.target.value)}
										placeholder="Dupont"
										required
									/>
									{errors.lastName && (
										<p className="text-sm text-destructive">
											{errors.lastName}
										</p>
									)}
								</div>
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
									Minimum 8 caracteres
								</p>
							</div>
							<Button type="submit" disabled={processing} className="w-full">
								{processing ? "Inscription..." : "S'inscrire"}
							</Button>
						</form>
						<p className="text-center text-sm text-muted-foreground mt-4">
							Deja un compte ?{" "}
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
