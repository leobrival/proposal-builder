import { Link } from "@inertiajs/react";
import type { ReactNode } from "react";

interface GuestLayoutProps {
	children: ReactNode;
}

export default function GuestLayout({ children }: GuestLayoutProps) {
	return (
		<div className="min-h-screen flex flex-col bg-background">
			<header className="border-b border-border">
				<div className="container mx-auto px-4 py-4 flex items-center justify-between">
					<Link href="/" className="text-xl font-bold text-primary">
						Sponseasy
					</Link>
					<nav className="flex items-center gap-4">
						<Link
							href="/login"
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							Connexion
						</Link>
						<Link
							href="/register"
							className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
						>
							Inscription
						</Link>
					</nav>
				</div>
			</header>
			<main className="flex-1 flex items-center justify-center p-4">
				{children}
			</main>
			<footer className="border-t border-border py-4">
				<div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
					&copy; {new Date().getFullYear()} Sponseasy. Tous droits réservés.
				</div>
			</footer>
		</div>
	);
}
