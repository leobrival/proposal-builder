import { Link, usePage } from "@inertiajs/react";
import {
	ChevronUp,
	FileText,
	LayoutDashboard,
	LogOut,
	Plus,
	Search,
	Settings,
	Shield,
	User,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { AssistantChat } from "~/components/assistant/assistant-chat";
import { CommandMenu } from "~/components/command-menu";
import { ThemeProvider } from "~/components/theme-provider";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
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
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarRail,
	SidebarTrigger,
} from "~/components/ui/sidebar";
import type { SharedProps } from "../../types";

interface AppLayoutProps {
	children: ReactNode;
}

const navigationItems = [
	{
		title: "Dashboard",
		url: "/dashboard",
		icon: LayoutDashboard,
	},
	{
		title: "Propositions",
		url: "/proposals",
		icon: FileText,
	},
];

export default function AppLayout({ children }: AppLayoutProps) {
	const { user } = usePage<SharedProps>().props;
	const [commandMenuOpen, setCommandMenuOpen] = useState(false);

	const isAdmin = user?.isAdmin ?? false;

	const getEmailInitial = (email: string) => {
		return email?.charAt(0).toUpperCase() || "U";
	};

	const currentPath =
		typeof window !== "undefined" ? window.location.pathname : "";

	// Handle Cmd+K keyboard shortcut for command menu
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
		<ThemeProvider defaultTheme="system" storageKey="sponseasy-theme">
			<SidebarProvider>
				<Sidebar collapsible="icon">
					<SidebarHeader>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton size="lg" asChild>
									<Link href="/dashboard">
										<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
											<span className="text-sm font-bold">S</span>
										</div>
										<div className="grid flex-1 text-left text-sm leading-tight">
											<span className="truncate font-semibold">Sponseasy</span>
											<span className="truncate text-xs text-muted-foreground">
												Sponsoring
											</span>
										</div>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarHeader>

					<SidebarContent>
						{/* Quick Actions */}
						<SidebarGroup>
							<SidebarGroupLabel>Actions rapides</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									<SidebarMenuItem>
										<SidebarMenuButton asChild>
											<Link href="/proposals/new">
												<Plus className="size-4" />
												<span>Nouvelle proposition</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
									<SidebarMenuItem>
										<SidebarMenuButton onClick={() => setCommandMenuOpen(true)}>
											<Search className="size-4" />
											<span>Recherche</span>
											<KbdGroup className="ml-auto">
												<Kbd>⌘</Kbd>
												<Kbd>K</Kbd>
											</KbdGroup>
										</SidebarMenuButton>
									</SidebarMenuItem>
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>

						{/* Main Navigation */}
						<SidebarGroup>
							<SidebarGroupLabel>Navigation</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									{navigationItems.map((item) => (
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton
												asChild
												isActive={currentPath === item.url}
												tooltip={item.title}
											>
												<Link href={item.url}>
													<item.icon className="size-4" />
													<span>{item.title}</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>

						{/* Admin Section */}
						{isAdmin && (
							<SidebarGroup>
								<SidebarGroupLabel>Administration</SidebarGroupLabel>
								<SidebarGroupContent>
									<SidebarMenu>
										<SidebarMenuItem>
											<SidebarMenuButton
												asChild
												isActive={currentPath.startsWith("/admin")}
												tooltip="Administration"
											>
												<Link href="/admin/dashboard">
													<Shield className="size-4" />
													<span>Panel Admin</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									</SidebarMenu>
								</SidebarGroupContent>
							</SidebarGroup>
						)}
					</SidebarContent>

					<SidebarFooter>
						<SidebarMenu>
							<SidebarMenuItem>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<SidebarMenuButton
											size="lg"
											className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
										>
											<Avatar className="h-8 w-8 rounded-lg">
												<AvatarFallback className="rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 text-white text-xs font-medium">
													{getEmailInitial(user?.email || "")}
												</AvatarFallback>
											</Avatar>
											<div className="grid flex-1 text-left text-sm leading-tight">
												<span className="truncate font-semibold">
													{user?.fullName}
												</span>
												<span className="truncate text-xs text-muted-foreground">
													{user?.email}
												</span>
											</div>
											<ChevronUp className="ml-auto size-4" />
										</SidebarMenuButton>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
										side="top"
										align="end"
										sideOffset={4}
									>
										<DropdownMenuLabel className="p-0 font-normal">
											<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
												<Avatar className="h-8 w-8 rounded-lg">
													<AvatarFallback className="rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 text-white text-xs font-medium">
														{getEmailInitial(user?.email || "")}
													</AvatarFallback>
												</Avatar>
												<div className="grid flex-1 text-left text-sm leading-tight">
													<span className="truncate font-semibold">
														{user?.fullName}
													</span>
													<span className="truncate text-xs text-muted-foreground">
														{user?.email}
													</span>
												</div>
												{isAdmin && (
													<span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
														Admin
													</span>
												)}
											</div>
										</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuGroup>
											<DropdownMenuItem asChild>
												<Link href="/profile">
													<User className="mr-2 h-4 w-4" />
													Mon profil
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem asChild>
												<Link href="/profile">
													<Settings className="mr-2 h-4 w-4" />
													Parametres
												</Link>
											</DropdownMenuItem>
										</DropdownMenuGroup>
										<DropdownMenuSeparator />
										<DropdownMenuItem asChild>
											<Link href="/logout" method="post" as="button">
												<LogOut className="mr-2 h-4 w-4" />
												Deconnexion
											</Link>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarFooter>
					<SidebarRail />
				</Sidebar>

				<SidebarInset>
					<header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
						<SidebarTrigger className="-ml-1" />
					</header>
					<main className="flex-1 p-6">{children}</main>
					<footer className="border-t border-border py-4">
						<div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
							&copy; {new Date().getFullYear()} Sponseasy. Tous droits reserves.
						</div>
					</footer>
				</SidebarInset>
			</SidebarProvider>

			{/* Command Menu */}
			<CommandMenu
				open={commandMenuOpen}
				onOpenChange={setCommandMenuOpen}
				isAdmin={isAdmin}
			/>

			{/* AI Assistant Chat */}
			<AssistantChat />
		</ThemeProvider>
	);
}
