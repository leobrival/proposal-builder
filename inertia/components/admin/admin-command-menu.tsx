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
	Route,
	Settings,
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
	CommandShortcut,
} from "~/components/ui/command";

interface AdminCommandMenuProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function AdminCommandMenu({
	open,
	onOpenChange,
}: AdminCommandMenuProps) {
	const { theme, setTheme } = useTheme();

	const scrollToSection = useCallback((sectionId: string) => {
		// If we're not on the admin dashboard, navigate there first
		if (!window.location.pathname.includes("/admin/dashboard")) {
			router.visit(`/admin/dashboard#${sectionId}`);
			return;
		}

		// Scroll to the section
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
			<CommandInput placeholder="Type a command or search..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>

				<CommandGroup heading="Navigation">
					<CommandItem
						onSelect={() => runCommand(() => router.visit("/admin/dashboard"))}
					>
						<LayoutDashboard className="mr-2 h-4 w-4" />
						Admin Dashboard
						<CommandShortcut>Go to admin dashboard</CommandShortcut>
					</CommandItem>
					<CommandItem
						onSelect={() => runCommand(() => router.visit("/dashboard"))}
					>
						<User className="mr-2 h-4 w-4" />
						User Dashboard
						<CommandShortcut>Go to user dashboard</CommandShortcut>
					</CommandItem>
					<CommandItem onSelect={() => runCommand(() => router.visit("/"))}>
						<Home className="mr-2 h-4 w-4" />
						Home Page
						<CommandShortcut>Go to home</CommandShortcut>
					</CommandItem>
				</CommandGroup>

				<CommandSeparator />

				<CommandGroup heading="Dashboard Sections">
					<CommandItem
						onSelect={() => runCommand(() => scrollToSection("users"))}
						keywords={["users", "members", "accounts"]}
					>
						<Users className="mr-2 h-4 w-4" />
						Users
						<CommandShortcut>Jump to section</CommandShortcut>
					</CommandItem>
					<CommandItem
						onSelect={() => runCommand(() => scrollToSection("proposals"))}
						keywords={["proposals", "sponsorships", "deals"]}
					>
						<FileText className="mr-2 h-4 w-4" />
						Proposals
						<CommandShortcut>Jump to section</CommandShortcut>
					</CommandItem>
					<CommandItem
						onSelect={() => runCommand(() => scrollToSection("countries"))}
						keywords={["countries", "geography", "location", "geo"]}
					>
						<Globe className="mr-2 h-4 w-4" />
						Countries
						<CommandShortcut>Jump to section</CommandShortcut>
					</CommandItem>
					<CommandItem
						onSelect={() =>
							runCommand(() => scrollToSection("devices-browsers"))
						}
						keywords={[
							"devices",
							"browsers",
							"mobile",
							"desktop",
							"chrome",
							"safari",
						]}
					>
						<Monitor className="mr-2 h-4 w-4" />
						Devices & Browsers
						<CommandShortcut>Jump to section</CommandShortcut>
					</CommandItem>
					<CommandItem
						onSelect={() =>
							runCommand(() => scrollToSection("operating-systems"))
						}
						keywords={["os", "operating", "systems", "windows", "mac", "linux"]}
					>
						<Monitor className="mr-2 h-4 w-4" />
						Operating Systems
						<CommandShortcut>Jump to section</CommandShortcut>
					</CommandItem>
					<CommandItem
						onSelect={() =>
							runCommand(() => scrollToSection("traffic-sources"))
						}
						keywords={["traffic", "sources", "referrers", "utm", "campaigns"]}
					>
						<BarChart3 className="mr-2 h-4 w-4" />
						Traffic Sources
						<CommandShortcut>Jump to section</CommandShortcut>
					</CommandItem>
					<CommandItem
						onSelect={() => runCommand(() => scrollToSection("routes"))}
						keywords={["routes", "api", "endpoints", "pages"]}
					>
						<Route className="mr-2 h-4 w-4" />
						System Routes
						<CommandShortcut>Jump to section</CommandShortcut>
					</CommandItem>
				</CommandGroup>

				<CommandSeparator />

				<CommandGroup heading="Theme">
					<CommandItem
						onSelect={() => runCommand(() => setTheme("light"))}
						keywords={["light", "bright", "day"]}
					>
						<Sun className="mr-2 h-4 w-4" />
						Light Mode
						{theme === "light" && <CommandShortcut>Active</CommandShortcut>}
					</CommandItem>
					<CommandItem
						onSelect={() => runCommand(() => setTheme("dark"))}
						keywords={["dark", "night", "black"]}
					>
						<Moon className="mr-2 h-4 w-4" />
						Dark Mode
						{theme === "dark" && <CommandShortcut>Active</CommandShortcut>}
					</CommandItem>
					<CommandItem
						onSelect={() => runCommand(() => setTheme("system"))}
						keywords={["system", "auto", "default"]}
					>
						<Monitor className="mr-2 h-4 w-4" />
						System Theme
						{theme === "system" && <CommandShortcut>Active</CommandShortcut>}
					</CommandItem>
				</CommandGroup>

				<CommandSeparator />

				<CommandGroup heading="Account">
					<CommandItem
						onSelect={() => runCommand(() => router.visit("/settings"))}
						keywords={["settings", "preferences", "profile"]}
					>
						<Settings className="mr-2 h-4 w-4" />
						Account Settings
					</CommandItem>
					<CommandItem
						onSelect={() => runCommand(() => router.post("/logout"))}
						keywords={["logout", "signout", "exit"]}
					>
						<LogOut className="mr-2 h-4 w-4" />
						Log Out
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	);
}
