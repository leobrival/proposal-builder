import { Head, useForm, usePage } from "@inertiajs/react";
import {
	AlertTriangle,
	Eye,
	EyeOff,
	Loader2,
	Save,
	Trash2,
	User,
} from "lucide-react";
import { useState } from "react";
import AppLayout from "../components/layouts/app-layout";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

interface ProfileProps {
	user: {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
		createdAt: string;
	};
	flash?: {
		success?: string;
		error?: string;
	};
}

export default function Profile() {
	const { user, flash } = usePage<ProfileProps>().props;

	return (
		<AppLayout>
			<Head title="Mon profil" />

			<div className="max-w-2xl mx-auto space-y-8">
				<div>
					<h1 className="text-3xl font-bold text-foreground">Mon profil</h1>
					<p className="text-muted-foreground mt-1">
						Gerez vos informations personnelles et vos parametres de securite
					</p>
				</div>

				{flash?.success && (
					<div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
						{flash.success}
					</div>
				)}

				{flash?.error && (
					<div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
						{flash.error}
					</div>
				)}

				<ProfileInfoForm user={user} />
				<PasswordForm />
				<DeleteAccountSection />
			</div>
		</AppLayout>
	);
}

function ProfileInfoForm({ user }: { user: ProfileProps["user"] }) {
	const { data, setData, put, processing, errors } = useForm({
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email,
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		put("/profile");
	};

	return (
		<div className="bg-card border border-border rounded-lg p-6">
			<div className="flex items-center gap-3 mb-6">
				<div className="p-2 bg-primary/10 rounded-lg">
					<User className="h-5 w-5 text-primary" />
				</div>
				<div>
					<h2 className="text-lg font-semibold text-foreground">
						Informations personnelles
					</h2>
					<p className="text-sm text-muted-foreground">
						Modifiez votre nom et adresse email
					</p>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="firstName">Prenom</Label>
						<Input
							id="firstName"
							type="text"
							value={data.firstName}
							onChange={(e) => setData("firstName", e.target.value)}
							placeholder="Votre prenom"
						/>
						{errors.firstName && (
							<p className="text-sm text-destructive">{errors.firstName}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="lastName">Nom</Label>
						<Input
							id="lastName"
							type="text"
							value={data.lastName}
							onChange={(e) => setData("lastName", e.target.value)}
							placeholder="Votre nom"
						/>
						{errors.lastName && (
							<p className="text-sm text-destructive">{errors.lastName}</p>
						)}
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="email">Adresse email</Label>
					<Input
						id="email"
						type="email"
						value={data.email}
						onChange={(e) => setData("email", e.target.value)}
						placeholder="votre@email.com"
					/>
					{errors.email && (
						<p className="text-sm text-destructive">{errors.email}</p>
					)}
				</div>

				<div className="flex justify-end">
					<Button type="submit" disabled={processing}>
						{processing ? (
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
						) : (
							<Save className="h-4 w-4 mr-2" />
						)}
						Enregistrer
					</Button>
				</div>
			</form>
		</div>
	);
}

function PasswordForm() {
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const { data, setData, put, processing, errors, reset } = useForm({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		put("/profile/password", {
			onSuccess: () => reset(),
		});
	};

	return (
		<div className="bg-card border border-border rounded-lg p-6">
			<div className="flex items-center gap-3 mb-6">
				<div className="p-2 bg-primary/10 rounded-lg">
					<svg
						className="h-5 w-5 text-primary"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
						/>
					</svg>
				</div>
				<div>
					<h2 className="text-lg font-semibold text-foreground">
						Changer le mot de passe
					</h2>
					<p className="text-sm text-muted-foreground">
						Mettez a jour votre mot de passe pour securiser votre compte
					</p>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="currentPassword">Mot de passe actuel</Label>
					<div className="relative">
						<Input
							id="currentPassword"
							type={showCurrentPassword ? "text" : "password"}
							value={data.currentPassword}
							onChange={(e) => setData("currentPassword", e.target.value)}
							placeholder="Votre mot de passe actuel"
						/>
						<button
							type="button"
							className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
							onClick={() => setShowCurrentPassword(!showCurrentPassword)}
						>
							{showCurrentPassword ? (
								<EyeOff className="h-4 w-4" />
							) : (
								<Eye className="h-4 w-4" />
							)}
						</button>
					</div>
					{errors.currentPassword && (
						<p className="text-sm text-destructive">{errors.currentPassword}</p>
					)}
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="newPassword">Nouveau mot de passe</Label>
						<div className="relative">
							<Input
								id="newPassword"
								type={showNewPassword ? "text" : "password"}
								value={data.newPassword}
								onChange={(e) => setData("newPassword", e.target.value)}
								placeholder="Minimum 8 caracteres"
							/>
							<button
								type="button"
								className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
								onClick={() => setShowNewPassword(!showNewPassword)}
							>
								{showNewPassword ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</button>
						</div>
						{errors.newPassword && (
							<p className="text-sm text-destructive">{errors.newPassword}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
						<div className="relative">
							<Input
								id="confirmPassword"
								type={showConfirmPassword ? "text" : "password"}
								value={data.confirmPassword}
								onChange={(e) => setData("confirmPassword", e.target.value)}
								placeholder="Confirmez le mot de passe"
							/>
							<button
								type="button"
								className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							>
								{showConfirmPassword ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</button>
						</div>
						{errors.confirmPassword && (
							<p className="text-sm text-destructive">
								{errors.confirmPassword}
							</p>
						)}
					</div>
				</div>

				<div className="flex justify-end">
					<Button type="submit" disabled={processing}>
						{processing ? (
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
						) : (
							<Save className="h-4 w-4 mr-2" />
						)}
						Mettre a jour
					</Button>
				</div>
			</form>
		</div>
	);
}

function DeleteAccountSection() {
	const [password, setPassword] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const { delete: destroy, processing, errors } = useForm({ password: "" });

	const handleDelete = () => {
		destroy("/profile", {
			data: { password },
			onSuccess: () => setIsOpen(false),
		});
	};

	return (
		<div className="bg-card border border-destructive/20 rounded-lg p-6">
			<div className="flex items-center gap-3 mb-4">
				<div className="p-2 bg-destructive/10 rounded-lg">
					<AlertTriangle className="h-5 w-5 text-destructive" />
				</div>
				<div>
					<h2 className="text-lg font-semibold text-foreground">
						Zone de danger
					</h2>
					<p className="text-sm text-muted-foreground">
						Actions irreversibles sur votre compte
					</p>
				</div>
			</div>

			<div className="flex items-center justify-between p-4 bg-destructive/5 rounded-lg">
				<div>
					<h3 className="font-medium text-foreground">Supprimer le compte</h3>
					<p className="text-sm text-muted-foreground">
						Cette action est irreversible. Toutes vos donnees seront supprimees.
					</p>
				</div>

				<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
					<AlertDialogTrigger asChild>
						<Button variant="destructive">
							<Trash2 className="h-4 w-4 mr-2" />
							Supprimer
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Etes-vous absolument sur ?</AlertDialogTitle>
							<AlertDialogDescription>
								Cette action est irreversible. Cela supprimera definitivement
								votre compte et toutes vos propositions de sponsoring.
							</AlertDialogDescription>
						</AlertDialogHeader>

						<div className="space-y-2 py-4">
							<Label htmlFor="deletePassword">
								Entrez votre mot de passe pour confirmer
							</Label>
							<Input
								id="deletePassword"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Votre mot de passe"
							/>
							{errors.password && (
								<p className="text-sm text-destructive">{errors.password}</p>
							)}
						</div>

						<AlertDialogFooter>
							<AlertDialogCancel onClick={() => setPassword("")}>
								Annuler
							</AlertDialogCancel>
							<AlertDialogAction
								onClick={handleDelete}
								disabled={processing || !password}
								className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							>
								{processing ? (
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								) : (
									<Trash2 className="h-4 w-4 mr-2" />
								)}
								Supprimer mon compte
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	);
}
