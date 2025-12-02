import { router } from "@inertiajs/react";
import {
	BarChart3,
	FileText,
	Globe,
	Home,
	LayoutDashboard,
	LogOut,
	Monitor,
	Moon,
	Plus,
	Route,
	Settings,
	Shield,
	Sun,
	User,
	Users,
} from "lucide-react";
import { useCallback } from "react";
import { useTheme } from "~/components/theme-provider";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "~/components/ui/command";
import { Kbd, KbdGroup } from "~/components/ui/kbd";

interface CommandMenuProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	isAdmin?: boolean;
}

export function CommandMenu({
	open,
	onOpenChange,
	isAdmin = false,
}: CommandMenuProps) {
	const { theme, setTheme } = useTheme();

	const scrollToSection = useCallback((sectionId: string) => {
		if (!window.location.pathname.includes("/admin/dashboard")) {
			router.visit(`/admin/dashboard#${sectionId}`);
			return;
		}

		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	}, []);

	const runCommand = useCallback(
		(command: () => void) => {
			onOpenChange(false);
			command();
		},
		[onOpenChange],
	);

	return (
		<CommandDialog open={open} onOpenChange={onOpenChange}>
			<CommandInput placeholder="Rechercher une commande..." />
			<CommandList>
				<CommandEmpty>Aucun resultat trouve.</CommandEmpty>

				{/* Navigation - Available to all users */}
				<CommandGroup heading="Navigation">
					<CommandItem
						onSelect={() => runCommand(() => router.visit("/dashboard"))}
					>
						<LayoutDashboard className="mr-2 h-4 w-4" />
						<span>Dashboard</span>
						<KbdGroup className="ml-auto">
							<Kbd>G</Kbd>
							<Kbd>D</Kbd>
						</KbdGroup>
					</CommandItem>
					<CommandItem
						onSelect={() => runCommand(() => router.visit("/proposals"))}
					>
						<FileText className="mr-2 h-4 w-4" />
						<span>Mes propositions</span>
						<KbdGroup className="ml-auto">
							<Kbd>G</Kbd>
							<Kbd>P</Kbd>
						</KbdGroup>
					</CommandItem>
					<CommandItem
						onSelect={() => runCommand(() => router.visit("/proposals/new"))}
					>
						<Plus className="mr-2 h-4 w-4" />
						<span>Nouvelle proposition</span>
						<KbdGroup className="ml-auto">
							<Kbd>N</Kbd>
						</KbdGroup>
					</CommandItem>
					<CommandItem onSelect={() => runCommand(() => router.visit("/"))}>
						<Home className="mr-2 h-4 w-4" />
						<span>Page d'accueil</span>
					</CommandItem>
				</CommandGroup>

				<CommandSeparator />

				{/* Admin-only section */}
				{isAdmin && (
					<>
						<CommandGroup heading="Administration">
							<CommandItem
								onSelect={() =>
									runCommand(() => router.visit("/admin/dashboard"))
								}
							>
								<Shield className="mr-2 h-4 w-4" />
								<span>Panel Admin</span>
								<KbdGroup className="ml-auto">
									<Kbd>G</Kbd>
									<Kbd>A</Kbd>
								</KbdGroup>
							</CommandItem>
							<CommandItem
								onSelect={() => runCommand(() => scrollToSection("users"))}
								keywords={["users", "membres", "comptes"]}
							>
								<Users className="mr-2 h-4 w-4" />
								<span>Utilisateurs</span>
							</CommandItem>
							<CommandItem
								onSelect={() => runCommand(() => scrollToSection("proposals"))}
								keywords={["proposals", "sponsoring"]}
							>
								<FileText className="mr-2 h-4 w-4" />
								<span>Toutes les propositions</span>
							</CommandItem>
							<CommandItem
								onSelect={() => runCommand(() => scrollToSection("countries"))}
								keywords={["pays", "geographie"]}
							>
								<Globe className="mr-2 h-4 w-4" />
								<span>Pays</span>
							</CommandItem>
							<CommandItem
								onSelect={() =>
									runCommand(() => scrollToSection("devices-browsers"))
								}
								keywords={["appareils", "navigateurs"]}
							>
								<Monitor className="mr-2 h-4 w-4" />
								<span>Appareils & Navigateurs</span>
							</CommandItem>
							<CommandItem
								onSelect={() =>
									runCommand(() => scrollToSection("traffic-sources"))
								}
								keywords={["trafic", "sources"]}
							>
								<BarChart3 className="mr-2 h-4 w-4" />
								<span>Sources de trafic</span>
							</CommandItem>
							<CommandItem
								onSelect={() => runCommand(() => scrollToSection("routes"))}
								keywords={["routes", "api", "endpoints"]}
							>
								<Route className="mr-2 h-4 w-4" />
								<span>Routes systeme</span>
							</CommandItem>
						</CommandGroup>
						<CommandSeparator />
					</>
				)}

				{/* Theme - Available to all users */}
				<CommandGroup heading="Theme">
					<CommandItem
						onSelect={() => runCommand(() => setTheme("light"))}
						keywords={["clair", "jour"]}
					>
						<Sun className="mr-2 h-4 w-4" />
						<span>Mode clair</span>
						{theme === "light" && (
							<Kbd className="ml-auto bg-primary/10 text-primary">Actif</Kbd>
						)}
					</CommandItem>
					<CommandItem
						onSelect={() => runCommand(() => setTheme("dark"))}
						keywords={["sombre", "nuit"]}
					>
						<Moon className="mr-2 h-4 w-4" />
						<span>Mode sombre</span>
						{theme === "dark" && (
							<Kbd className="ml-auto bg-primary/10 text-primary">Actif</Kbd>
						)}
					</CommandItem>
					<CommandItem
						onSelect={() => runCommand(() => setTheme("system"))}
						keywords={["systeme", "auto"]}
					>
						<Monitor className="mr-2 h-4 w-4" />
						<span>Theme systeme</span>
						{theme === "system" && (
							<Kbd className="ml-auto bg-primary/10 text-primary">Actif</Kbd>
						)}
					</CommandItem>
				</CommandGroup>

				<CommandSeparator />

				{/* Account - Available to all users */}
				<CommandGroup heading="Compte">
					<CommandItem
						onSelect={() => runCommand(() => router.visit("/profile"))}
						keywords={["profil", "compte"]}
					>
						<User className="mr-2 h-4 w-4" />
						<span>Mon profil</span>
					</CommandItem>
					<CommandItem
						onSelect={() => runCommand(() => router.visit("/profile"))}
						keywords={["parametres", "preferences"]}
					>
						<Settings className="mr-2 h-4 w-4" />
						<span>Parametres</span>
					</CommandItem>
					<CommandItem
						onSelect={() => runCommand(() => router.post("/logout"))}
						keywords={["deconnexion", "sortir"]}
					>
						<LogOut className="mr-2 h-4 w-4" />
						<span>Deconnexion</span>
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	);
}
