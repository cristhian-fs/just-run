import { createFileRoute, redirect } from "@tanstack/react-router";

import LoginScreenImage from "@/assets/login-screen.png";
import { LoginForm } from "@/features/auth/components/login-form";

import { userQueryOptions } from "@/lib/api";
import { AppLogo } from "@/components/logo";

export const Route = createFileRoute("/login")({
  component: () => <LoginPage />,
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(userQueryOptions());
    if (user) {
      throw redirect({ to: "/" });
    }
  },
});

function LoginPage() {
  return (
    <main className="mx-auto max-w-7xl md:px-6 lg:px-8 py-8 lg:py-16 min-h-screen">
      <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:grid-cols-[450px_1fr] lg:items-center h-full">
        <div className="px-6 lg:px-0 lg:pr-4 lg:pt-4 flex flex-col items-start">
          <AppLogo className="text-foreground" />
          <LoginForm />
        </div>
        <div className="sm:px-6 lg:px-0 md:h-[calc(100vh-8rem)]">
          <div className="h-full relative isolate overflow-hidden bg-indigo-500 px-6 pt-8 sm:mx-auto sm:max-w-3xl sm:rounded-3xl sm:pl-16 sm:pr-0 sm:pt-16 lg:mx-0 lg:max-w-none">
            <div className="mx-auto max-w-2xl sm:mx-0 sm:max-w-3xl">
              <img
                src={LoginScreenImage}
                alt="Product screenshot"
                width={2432}
                height={1442}
                className="-mb-12 w-[57rem] sm:w-auto max-w-none rounded-tl-xl bg-gray-800 ring-1 ring-white/10"
              />
            </div>
            <div
              className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 sm:rounded-3xl"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
