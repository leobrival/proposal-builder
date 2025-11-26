import { getDirname } from "@adonisjs/core/helpers";
import inertia from "@adonisjs/inertia/client";
import adonisjs from "@adonisjs/vite/client";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		inertia({ ssr: { enabled: false } }),
		react(),
		adonisjs({
			entrypoints: ["inertia/app/app.tsx"],
			reload: ["resources/views/**/*.edge"],
		}),
	],

	/**
	 * Define aliases for importing modules from
	 * your frontend code
	 */
	resolve: {
		alias: {
			"~/": `${getDirname(import.meta.url)}/inertia/`,
			"@/": `${getDirname(import.meta.url)}/inertia/`,
		},
	},

	/**
	 * Build optimization - Code splitting for better performance
	 */
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					// Vendor chunks - split large dependencies
					"vendor-react": ["react", "react-dom"],
					"vendor-inertia": ["@inertiajs/react"],
					"vendor-radix": ["@radix-ui/react-dialog"],
					"vendor-lucide": ["lucide-react"],
					"vendor-utils": ["clsx", "tailwind-merge", "class-variance-authority"],
				},
			},
		},
	},
});
