import { Link, usePage } from "@inertiajs/react";
import {
	Bell,
	Book,
	Command,
	FileText,
	HelpCircle,
	Home,
	LogOut,
	MessageSquare,
	Monitor,
	Moon,
	Settings,
	Sparkles,
	Sun,
	User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AdminCommandMenu } from "~/components/admin/admin-command-menu";
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
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";

interface AdminHeaderProps {
	notificationCount?: number;
}

export function AdminHeader({ notificationCount = 0 }: AdminHeaderProps) {
	const { user } = usePage().props as {
		user: { fullName: string; email: string };
	};
	const { theme, setTheme } = useTheme();
	const [commandMenuOpen, setCommandMenuOpen] = useState(false);

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
			<header className="sticky top-0 z-30 flex h-14 items-center justify-end gap-2 border-b bg-card px-6">
				{/* Feedback Button */}
				<Button variant="outline" size="sm" className="gap-2">
					<MessageSquare className="h-4 w-4" />
					Feedback
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
							No new notifications
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
								Help
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
								Docs
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
								Changelog
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
								<p className="text-sm font-medium">{user?.fullName}</p>
								<p className="text-xs text-muted-foreground">{user?.email}</p>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem asChild>
								<Link
									href="/admin/dashboard"
									className="flex items-center gap-2"
								>
									<User className="h-4 w-4" />
									Dashboard
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href="/settings" className="flex items-center gap-2">
									<Settings className="h-4 w-4" />
									Account Settings
								</Link>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem onSelect={() => setCommandMenuOpen(true)}>
							<Command className="h-4 w-4" />
							Command Menu
							<DropdownMenuShortcut>
								<span className="flex items-center gap-0.5">
									<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
										<span className="text-xs">&#8984;</span>
									</kbd>
									<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
										K
									</kbd>
								</span>
							</DropdownMenuShortcut>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
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
										aria-label="System theme"
										className="h-7 w-7 p-0"
									>
										<Monitor className="h-3.5 w-3.5" />
									</ToggleGroupItem>
									<ToggleGroupItem
										value="light"
										aria-label="Light theme"
										className="h-7 w-7 p-0"
									>
										<Sun className="h-3.5 w-3.5" />
									</ToggleGroupItem>
									<ToggleGroupItem
										value="dark"
										aria-label="Dark theme"
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
								Home Page
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
								Log Out
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</header>

			{/* Command Menu */}
			<AdminCommandMenu
				open={commandMenuOpen}
				onOpenChange={setCommandMenuOpen}
			/>
		</>
	);
}
