import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { userQueryOptions } from "@/lib/api";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import LoadingScreen from "@/components/loading-screen";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/_index")({
  component: AppLayoutComponent,
  beforeLoad: async ({ context, location }) => {
    const user = await context.queryClient.ensureQueryData(userQueryOptions());
    if (!user) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
});

function AppLayoutComponent() {
  const { data: user, isLoading } = useQuery(userQueryOptions());
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user?.hasCompleteOnboarding) {
    navigate({ to: "/onboarding" });
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
