import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_index/apis")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_index/apis"!</div>;
}
