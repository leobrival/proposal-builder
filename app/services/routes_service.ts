import router from "@adonisjs/core/services/router";

export type RouteType = "page" | "api" | "sse" | "action";

export interface RouteInfo {
	id: string;
	name: string;
	pattern: string;
	methods: string[];
	type: RouteType;
	controller: string;
	middleware: string[];
}

export default class RoutesService {
	/**
	 * Determines the route type based on pattern and methods
	 */
	private static getRouteType(pattern: string, methods: string[]): RouteType {
		// SSE routes (Transmit)
		if (pattern.startsWith("/__transmit")) {
			return "sse";
		}

		// API routes
		if (pattern.includes("/api/")) {
			return "api";
		}

		// Action routes (POST, PUT, DELETE, PATCH without rendering)
		if (
			methods.length === 1 &&
			["POST", "PUT", "DELETE", "PATCH"].includes(methods[0])
		) {
			return "action";
		}

		// Default to page (GET routes that render views)
		return "page";
	}

	/**
	 * Extracts controller name from handler
	 */
	private static getControllerName(handler: unknown): string {
		if (typeof handler === "object" && handler !== null) {
			const h = handler as { moduleNameOrPath?: string; method?: string };
			if (h.moduleNameOrPath) {
				const parts = h.moduleNameOrPath.split("/");
				const fileName = parts[parts.length - 1].replace(".js", "");
				const method = h.method || "handle";
				return `${fileName}#${method}`;
			}
		}
		return "closure";
	}

	/**
	 * Get all routes from the router
	 */
	static getAllRoutes(): RouteInfo[] {
		const routes: RouteInfo[] = [];

		// toJSON() returns Record<string, RouteJSON[]> where key is the domain
		const routesMap = router.toJSON();

		// Iterate over the domains (keys) in the routes map
		for (const domain of Object.keys(routesMap)) {
			const domainRoutes = routesMap[domain];

			for (const route of domainRoutes) {
				const type = this.getRouteType(route.pattern, route.methods);
				const controller = this.getControllerName(route.handler);

				// Extract middleware names from the middleware object
				let middlewareNames: string[] = [];
				if (route.middleware) {
					const mw = route.middleware as unknown;
					if (Array.isArray(mw)) {
						middlewareNames = mw.map((m) =>
							typeof m === "string" ? m : String(m)
						);
					} else if (typeof mw === "object" && mw !== null) {
						// Middleware object may have an 'all' method or be iterable
						const mwObj = mw as { all?: () => unknown[] };
						if (typeof mwObj.all === "function") {
							const allMw = mwObj.all();
							middlewareNames = allMw.map((m) => {
								if (typeof m === "object" && m !== null) {
									const named = m as { name?: string };
									return named.name || "middleware";
								}
								return String(m);
							});
						}
					}
				}

				routes.push({
					id: `${route.methods.join("-")}-${route.pattern}`,
					name: route.name || route.pattern,
					pattern: route.pattern,
					methods: route.methods,
					type,
					controller,
					middleware: middlewareNames,
				});
			}
		}

		return routes;
	}

	/**
	 * Get routes filtered by type
	 */
	static getRoutesByType(type: RouteType): RouteInfo[] {
		return this.getAllRoutes().filter((route) => route.type === type);
	}

	/**
	 * Get route counts by type
	 */
	static getRouteCounts(): Record<RouteType, number> {
		const routes = this.getAllRoutes();
		return {
			page: routes.filter((r) => r.type === "page").length,
			api: routes.filter((r) => r.type === "api").length,
			sse: routes.filter((r) => r.type === "sse").length,
			action: routes.filter((r) => r.type === "action").length,
		};
	}
}
