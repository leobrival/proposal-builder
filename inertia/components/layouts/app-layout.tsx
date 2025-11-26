import { Link, router, usePage } from "@inertiajs/react";
import type { ReactNode } from "react";
import type { SharedProps } from "../../types";

interface AppLayoutProps {
	children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
	const { user } = usePage<SharedProps>().props;

	const handleLogout = () => {
		router.post("/logout");
	};

	return (
		<div className="min-h-screen flex flex-col bg-background">
			<header className="border-b border-border bg-card">
				<div className="container mx-auto px-4 py-4 flex items-center justify-between">
					<div className="flex items-center gap-8">
						<Link href="/dashboard" className="text-xl font-bold text-primary">
							Sponseasy
						</Link>
						<nav className="flex items-center gap-4">
							<Link
								href="/dashboard"
								className="text-sm text-muted-foreground hover:text-foreground transition-colors"
							>
								Dashboard
							</Link>
						</nav>
					</div>
					<div className="flex items-center gap-4">
						<span className="text-sm text-muted-foreground">
							{user?.fullName}
						</span>
						<button
							type="button"
							onClick={handleLogout}
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							Déconnexion
						</button>
					</div>
				</div>
			</header>
			<main className="flex-1 container mx-auto px-4 py-8">{children}</main>
			<footer className="border-t border-border py-4">
				<div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
					&copy; {new Date().getFullYear()} Sponseasy. Tous droits réservés.
				</div>
			</footer>
		</div>
	);
}
