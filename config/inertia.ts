import { defineConfig } from "@adonisjs/inertia";
import type { InferSharedProps } from "@adonisjs/inertia/types";

const inertiaConfig = defineConfig({
	rootView: "inertia_layout",

	sharedData: {
		user: (ctx) => {
			const user = ctx.auth?.user;
			if (!user) return null;
			return {
				id: user.id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				fullName: user.fullName,
				isAdmin: user.isAdmin,
			};
		},
		flash: (ctx) => ctx.session?.flashMessages.all() ?? {},
		errors: (ctx) => ctx.session?.flashMessages.get("errors") ?? {},
		appName: () => "Sponseasy",
	},

	ssr: {
		enabled: false,
		entrypoint: "inertia/app/ssr.tsx",
	},
});

export default inertiaConfig;

declare module "@adonisjs/inertia/types" {
	export interface SharedProps extends InferSharedProps<typeof inertiaConfig> {}
}
