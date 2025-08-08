import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Toaster } from "sonner";
import { Modals } from "@/components/modals";
import { ThemeProvider } from "@/components/theme-provider";

interface RouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootComponent,
});

function RootComponent() {
	return (
		<>
			<ThemeProvider defaultTheme='dark' storageKey='hono-fas'>
				<Toaster richColors />
				<Modals />
				<Outlet />
				<ReactQueryDevtools />
				<TanStackRouterDevtools position='bottom-left' />
			</ThemeProvider>
		</>
	);
}
