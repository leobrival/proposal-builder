/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import "../css/app.css";
import { resolvePageComponent } from "@adonisjs/inertia/helpers";
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "../components/theme-provider";
import { TooltipProvider } from "../components/ui/tooltip";

const appName = import.meta.env.VITE_APP_NAME || "AdonisJS";

createInertiaApp({
	progress: { color: "#5468FF" },

	title: (title) => `${title} - ${appName}`,

	resolve: (name) => {
		return resolvePageComponent(
			`../pages/${name}.tsx`,
			import.meta.glob("../pages/**/*.tsx"),
		);
	},

	setup({ el, App, props }) {
		createRoot(el).render(
			<ThemeProvider defaultTheme="system" storageKey="spons-easy-theme">
				<TooltipProvider>
					<App {...props} />
				</TooltipProvider>
			</ThemeProvider>,
		);
	},
});
