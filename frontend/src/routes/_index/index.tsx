import { createFileRoute } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_index/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: session } = authClient.useSession();

  return (
    <div className="p-4 md:p-6">
      <h3 className="text-xl md:text-2xl">
        Welcome back, {session?.user.name}!
      </h3>
    </div>
  );
}
