import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { Toaster } from "sonner";

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
      <ThemeProvider defaultTheme="dark" storageKey="hono-fas">
        <Toaster richColors />
        <Outlet />
        <ReactQueryDevtools />
        <TanStackRouterDevtools position="bottom-left" />
      </ThemeProvider>
    </>
  );
}
