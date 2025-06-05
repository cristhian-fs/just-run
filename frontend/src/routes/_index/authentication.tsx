import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_index/authentication")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_index/authentication"!</div>;
}
