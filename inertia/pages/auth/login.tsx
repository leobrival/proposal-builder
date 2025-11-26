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
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { PasswordInput } from "../../components/ui/password-input";

export default function Login() {
	const { data, setData, post, processing, errors } = useForm({
		email: "",
		password: "",
		remember: false,
	});

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		post("/login");
	};

	return (
		<GuestLayout>
			<Head title="Connexion" />
			<div className="w-full max-w-md">
				<Card>
					<CardHeader className="text-center">
						<CardTitle className="text-2xl">Connexion</CardTitle>
						<CardDescription>
							Connectez-vous à votre compte Sponseasy
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
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
								/>
								{errors.password && (
									<p className="text-sm text-destructive">{errors.password}</p>
								)}
							</div>
							<div className="flex items-center space-x-2">
								<Checkbox
									id="remember"
									checked={data.remember}
									onChange={(e) => setData("remember", e.target.checked)}
								/>
								<Label htmlFor="remember" className="font-normal">
									Se souvenir de moi
								</Label>
							</div>
							<Button type="submit" disabled={processing} className="w-full">
								{processing ? "Connexion..." : "Se connecter"}
							</Button>
						</form>
						<p className="text-center text-sm text-muted-foreground mt-4">
							Pas encore de compte ?{" "}
							<Link href="/register" className="text-primary hover:underline">
								S'inscrire
							</Link>
						</p>
					</CardContent>
				</Card>
			</div>
		</GuestLayout>
	);
}
