import { Link, usePage } from "@inertiajs/react";
import {
	Bell,
	Book,
	Command,
	FileText,
	HelpCircle,
	Home,
	LayoutDashboard,
	LogOut,
	MessageSquare,
	Monitor,
	Moon,
	Settings,
	Shield,
	Sparkles,
	Sun,
	User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { CommandMenu } from "~/components/command-menu";
import { useTheme } from "~/components/theme-provider";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Kbd, KbdGroup } from "~/components/ui/kbd";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";

interface AppHeaderProps {
	notificationCount?: number;
	showLogo?: boolean;
}

interface UserProps {
	fullName: string;
	email: string;
	role?: "user" | "admin";
}

export function AppHeader({
	notificationCount = 0,
	showLogo = false,
}: AppHeaderProps) {
	const { user } = usePage().props as { user: UserProps };
	const { theme, setTheme } = useTheme();
	const [commandMenuOpen, setCommandMenuOpen] = useState(false);

	const isAdmin = user?.role === "admin";

	const getEmailInitial = (email: string) => {
		return email?.charAt(0).toUpperCase() || "U";
	};

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				setCommandMenuOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, []);

	return (
		<>
			<header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-card px-6">
				{/* Left side - Logo if needed */}
				<div className="flex items-center gap-4">
					{showLogo && (
						<Link href="/dashboard" className="text-xl font-bold text-primary">
							Sponseasy
						</Link>
					)}
				</div>

				{/* Right side - Actions */}
				<div className="flex items-center gap-2">
					{/* Feedback Button */}
					<Button variant="outline" size="sm" className="gap-2">
						<MessageSquare className="h-4 w-4" />
						<span className="hidden sm:inline">Feedback</span>
					</Button>

					{/* Notifications */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="relative">
								<Bell className="h-5 w-5" />
								{notificationCount > 0 && (
									<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
										{notificationCount > 9 ? "9+" : notificationCount}
									</span>
								)}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-80">
							<DropdownMenuLabel>Notifications</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<div className="py-6 text-center text-sm text-muted-foreground">
								Aucune nouvelle notification
							</div>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Help Menu */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon">
								<Book className="h-5 w-5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-48">
							<DropdownMenuItem asChild>
								<a
									href="#"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2"
								>
									<HelpCircle className="h-4 w-4" />
									Aide
								</a>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<a
									href="#"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2"
								>
									<FileText className="h-4 w-4" />
									Documentation
								</a>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<a
									href="#"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2"
								>
									<Sparkles className="h-4 w-4" />
									Nouveautes
								</a>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* User Profile */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="rounded-full">
								<Avatar className="h-8 w-8">
									<AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-500 text-white text-xs font-medium">
										{getEmailInitial(user?.email)}
									</AvatarFallback>
								</Avatar>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuLabel className="font-normal">
								<div className="flex flex-col space-y-1">
									<div className="flex items-center gap-2">
										<p className="text-sm font-medium">{user?.fullName}</p>
										{isAdmin && (
											<span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
												Admin
											</span>
										)}
									</div>
									<p className="text-xs text-muted-foreground">{user?.email}</p>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />

							{/* Navigation - Different based on role */}
							<DropdownMenuGroup>
								<DropdownMenuItem asChild>
									<Link href="/dashboard" className="flex items-center gap-2">
										<LayoutDashboard className="h-4 w-4" />
										Dashboard
									</Link>
								</DropdownMenuItem>

								{/* Admin-only: Admin Panel */}
								{isAdmin && (
									<DropdownMenuItem asChild>
										<Link
											href="/admin/dashboard"
											className="flex items-center gap-2"
										>
											<Shield className="h-4 w-4" />
											Administration
										</Link>
									</DropdownMenuItem>
								)}

								<DropdownMenuItem asChild>
									<Link href="/profile" className="flex items-center gap-2">
										<User className="h-4 w-4" />
										Mon profil
									</Link>
								</DropdownMenuItem>

								<DropdownMenuItem asChild>
									<Link href="/profile" className="flex items-center gap-2">
										<Settings className="h-4 w-4" />
										Parametres
									</Link>
								</DropdownMenuItem>
							</DropdownMenuGroup>

							<DropdownMenuSeparator />

							{/* Command Menu - Admin only or everyone depending on preference */}
							<DropdownMenuItem onSelect={() => setCommandMenuOpen(true)}>
								<Command className="h-4 w-4" />
								Menu rapide
								<KbdGroup className="ml-auto">
									<Kbd>⌘</Kbd>
									<Kbd>K</Kbd>
								</KbdGroup>
							</DropdownMenuItem>

							<DropdownMenuSeparator />

							{/* Theme Switcher */}
							<div className="px-2 py-1.5">
								<div className="flex items-center justify-between">
									<span className="text-sm">Theme</span>
									<ToggleGroup
										type="single"
										value={theme}
										onValueChange={(value) =>
											value && setTheme(value as "system" | "light" | "dark")
										}
										className="gap-0"
									>
										<ToggleGroupItem
											value="system"
											aria-label="Theme systeme"
											className="h-7 w-7 p-0"
										>
											<Monitor className="h-3.5 w-3.5" />
										</ToggleGroupItem>
										<ToggleGroupItem
											value="light"
											aria-label="Theme clair"
											className="h-7 w-7 p-0"
										>
											<Sun className="h-3.5 w-3.5" />
										</ToggleGroupItem>
										<ToggleGroupItem
											value="dark"
											aria-label="Theme sombre"
											className="h-7 w-7 p-0"
										>
											<Moon className="h-3.5 w-3.5" />
										</ToggleGroupItem>
									</ToggleGroup>
								</div>
							</div>

							<DropdownMenuSeparator />

							<DropdownMenuItem asChild>
								<Link href="/" className="flex items-center gap-2">
									<Home className="h-4 w-4" />
									Page d'accueil
								</Link>
							</DropdownMenuItem>

							<DropdownMenuSeparator />

							<DropdownMenuItem asChild>
								<Link
									href="/logout"
									method="post"
									as="button"
									className="flex w-full items-center gap-2"
								>
									<LogOut className="h-4 w-4" />
									Deconnexion
								</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</header>

			{/* Command Menu */}
			<CommandMenu
				open={commandMenuOpen}
				onOpenChange={setCommandMenuOpen}
				isAdmin={isAdmin}
			/>
		</>
	);
}
