import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_index/users")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_index/users"!</div>;
}
