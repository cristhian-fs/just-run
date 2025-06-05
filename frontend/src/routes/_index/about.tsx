import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_index/about")({
  component: AboutComponent,
});

function AboutComponent() {
  return (
    <div className="p-4 md:p-6">
      <h3>About</h3>
    </div>
  );
}
