import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_index/clients")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_index/clients"!</div>;
}
