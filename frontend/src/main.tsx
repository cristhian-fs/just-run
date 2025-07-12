import React from "react";
import { createRouter, RouterProvider } from "@tanstack/react-router";

import ReactDOM from "react-dom/client";

import { routeTree } from "./routeTree.gen";

import "@/globals.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Loader } from "lucide-react";

const queryClient = new QueryClient();

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  context: { queryClient },
  defaultPendingComponent: () => (
    <div className="mx-auto mt-8 flex flex-col items-center justify-center">
      <Loader className="animate-spin" />
      <p className="text-muted-foreground mt-2 text-sm">Loading...</p>
    </div>
  ),
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}
