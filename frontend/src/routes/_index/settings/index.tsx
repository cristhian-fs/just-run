import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { ProfileTabContent } from "@/features/settings/components/profile-tab-content";
import { TestsTabContent } from "@/features/settings/components/tests-tab-content";
import { FileChartColumn, LockIcon, UserIcon } from "lucide-react";

import { userQueryOptions } from "@/lib/api";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_index/settings/")({
  component: RouteComponent,
  beforeLoad: ({ context, location }) => {
    const user = context.queryClient.ensureQueryData(userQueryOptions());
    if (!user) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
});

function RouteComponent() {
  const { data: user } = useQuery(userQueryOptions());

  if (!user) return null;

  return (
    <div className="py-4 md:py-8">
      <div className="px-4 md:px-8">
        <h3 className="text-xl md:text-2xl">Configurações pessoais</h3>
      </div>
      <Tabs defaultValue="profile" className="mt-4">
        <TabsList className="h-auto w-full justify-start rounded-none border-0 border-b bg-transparent px-4 py-0 md:px-8">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:border-primary dark:data-[state=active]:border-primary flex-0 group h-auto w-auto rounded-none border-0 border-b border-transparent py-2 font-normal data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:bg-transparent"
          >
            <span className="group-data-[state=active]:bg-muted group-data-[state=active]:dark:bg-muted/50 flex items-center gap-x-2 rounded-lg px-2 py-1 group-data-[state=active]:border">
              <UserIcon className="size-4" />
              Meu perfil
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="tests"
            className="data-[state=active]:border-primary dark:data-[state=active]:border-primary flex-0 group h-auto w-auto rounded-none border-0 border-b border-transparent py-2 font-normal data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:bg-transparent"
          >
            <span className="group-data-[state=active]:bg-muted group-data-[state=active]:dark:bg-muted/50 flex items-center gap-x-2 rounded-lg px-2 py-1 group-data-[state=active]:border">
              <FileChartColumn className="size-4" />
              Meus testes
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="privary"
            className="data-[state=active]:border-primary dark:data-[state=active]:border-primary flex-0 group h-auto w-auto rounded-none border-0 border-b border-transparent py-2 font-normal data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:bg-transparent"
          >
            <span className="group-data-[state=active]:bg-muted group-data-[state=active]:dark:bg-muted/50 flex items-center gap-x-2 rounded-lg px-2 py-1 group-data-[state=active]:border">
              <LockIcon className="size-4" />
              Privacidade e segurança
            </span>
          </TabsTrigger>
        </TabsList>
        <ProfileTabContent />
        <TestsTabContent userId={user.id} />
      </Tabs>
    </div>
  );
}
