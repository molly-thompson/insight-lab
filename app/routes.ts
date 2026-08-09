import {
	index,
	layout,
	type RouteConfig,
	route,
} from "@react-router/dev/routes";

export default [
	layout("layouts/app-layout.tsx", [
		index("routes/home.tsx"),
		route("assessment", "routes/assessment.tsx"),
		route("results", "routes/results.tsx"),
	]),
] satisfies RouteConfig;
