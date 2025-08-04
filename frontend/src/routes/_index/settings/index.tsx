import { createFileRoute, Link, redirect } from "@tanstack/react-router";

import { ProfileTabContent } from "@/features/settings/components/profile-tab-content";
import { TestsTabContent } from "@/features/settings/components/tests-tab-content";
import { ChevronLeft, FileChartColumn, LockIcon, UserIcon } from "lucide-react";
import { z } from "zod";

import { userQueryOptions } from "@/lib/api";
import { CUSTOM_TABS_CLASSNAMES } from "@/lib/consts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_index/settings/")({
  component: RouteComponent,
  validateSearch: z.object({ from: z.string().optional() }),
  beforeLoad: ({ context, location }) => {
    const user = context.queryClient.ensureQueryData(userQueryOptions());
    if (!user) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
});

function RouteComponent() {
  const { from } = Route.useSearch();

  return (
    <div className="py-4 md:py-8">
      <div className="px-4">
        <h3 className="text-xl md:text-2xl">Configurações pessoais</h3>
      </div>
      <Tabs defaultValue="profile" className="mt-4">
        <TabsList className={CUSTOM_TABS_CLASSNAMES.list}>
          <TabsTrigger
            value="profile"
            className={CUSTOM_TABS_CLASSNAMES.trigger}
          >
            <span className={CUSTOM_TABS_CLASSNAMES.innerSpan}>
              <UserIcon className="size-4" />
              Meu perfil
            </span>
          </TabsTrigger>
          <TabsTrigger value="tests" className={CUSTOM_TABS_CLASSNAMES.trigger}>
            <span className={CUSTOM_TABS_CLASSNAMES.innerSpan}>
              <FileChartColumn className="size-4" />
              Meus testes
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="privary"
            className={CUSTOM_TABS_CLASSNAMES.trigger}
          >
            <span className={CUSTOM_TABS_CLASSNAMES.innerSpan}>
              <LockIcon className="size-4" />
              Privacidade e segurança
            </span>
          </TabsTrigger>
        </TabsList>
        <ProfileTabContent />
        <TestsTabContent />
      </Tabs>
      <div className="px-4">
        {from === "onboarding" && (
          <Button asChild variant="secondary" className="mt-4">
            <Link to="/onboarding">
              <ChevronLeft />
              Voltar para o onboarding
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
