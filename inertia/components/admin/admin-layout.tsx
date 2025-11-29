import { Link, usePage } from "@inertiajs/react";
import {
	BarChart3,
	FileText,
	LayoutDashboard,
	LogOut,
	Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

interface AdminLayoutProps {
	children: ReactNode;
	title?: string;
	subtitle?: ReactNode;
}

const navItems = [
	{ href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/admin/users", label: "Users", icon: Users },
	{ href: "/admin/proposals", label: "Proposals", icon: FileText },
];

export function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
	const { url } = usePage();
	const { user } = usePage().props as { user: { fullName: string } };

	return (
		<div className="flex min-h-screen bg-background">
			{/* Sidebar */}
			<aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card">
				<div className="flex h-full flex-col">
					{/* Logo */}
					<div className="flex h-16 items-center border-b px-6">
						<Link href="/admin/dashboard" className="flex items-center gap-2">
							<BarChart3 className="h-6 w-6 text-primary" />
							<span className="text-lg font-semibold">Admin</span>
						</Link>
					</div>

					{/* Navigation */}
					<nav className="flex-1 space-y-1 px-3 py-4">
						{navItems.map((item) => {
							const isActive = url.startsWith(item.href);
							return (
								<Link
									key={item.href}
									href={item.href}
									className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
										isActive
											? "bg-primary text-primary-foreground"
											: "text-muted-foreground hover:bg-muted hover:text-foreground"
									}`}
								>
									<item.icon className="h-4 w-4" />
									{item.label}
								</Link>
							);
						})}
					</nav>

					<Separator />

					{/* User section */}
					<div className="p-4">
						<div className="mb-2 text-sm text-muted-foreground">
							Logged in as
						</div>
						<div className="mb-3 font-medium">{user?.fullName}</div>
						<Link href="/logout" method="post" as="button" className="w-full">
							<Button variant="outline" size="sm" className="w-full">
								<LogOut className="mr-2 h-4 w-4" />
								Logout
							</Button>
						</Link>
					</div>
				</div>
			</aside>

			{/* Main content */}
			<main className="ml-64 flex-1">
				{/* Header */}
				{title && (
					<header className="border-b bg-card px-8 py-6">
						<h1 className="text-2xl font-bold">{title}</h1>
						{subtitle && <div className="mt-2">{subtitle}</div>}
					</header>
				)}

				{/* Content */}
				<div className="p-8">{children}</div>
			</main>
		</div>
	);
}
