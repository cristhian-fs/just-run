import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { userQueryOptions } from "@/lib/api";

export const Route = createFileRoute("/app")({
	component: AppLayoutComponent,
	beforeLoad: async ({ context }) => {
		const user = await context.queryClient.ensureQueryData(userQueryOptions());

		if (!user) {
			throw redirect({ to: "/login" });
		}

		if (!user?.hasCompleteOnboarding) {
			throw redirect({ to: "/onboarding" });
		}
	},
});

function AppLayoutComponent() {
	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 72)",
					"--header-height": "calc(var(--spacing) * 12)",
				} as React.CSSProperties
			}
		>
			<AppSidebar variant='inset' />
			<SidebarInset>
				<div className='flex flex-1 flex-col'>
					<div className='p-3'>
						<SiteHeader />
					</div>
					<div className='@container/main flex flex-1 flex-col gap-2'>
						<Outlet />
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
