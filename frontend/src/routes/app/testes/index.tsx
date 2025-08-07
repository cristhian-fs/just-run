import { Suspense, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { getUserRunningTests } from "@/features/running-tests/api/get-user-running-tests";
import { useAddTest } from "@/features/settings/api/use-add-test";
import { RunningTestForm } from "@/features/settings/components/running-test-form";

import { TestFormData } from "@/shared/schemas";
import { CUSTOM_TABS_CLASSNAMES } from "@/lib/consts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveDialog } from "@/components/responsive-dialog";

import { TestStats } from "./-components/test-stats";
import { TestsCharts } from "./-components/tests-chart";
import { TestsOverview } from "./-components/tests-overview";
import { TestsTable } from "./-components/tests-table";

export const Route = createFileRoute("/app/testes/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutate: addTest, isPending: isAddingTest, isSuccess } = useAddTest();

  const handleSubmit = (data: TestFormData) => {
    addTest({
      form: {
        distanceM: data.distanceM.toString(),
        time: data.time,
        testType: data.testType,
        goal: data.goal,
        testDate: data.testDate.toISOString(),
        weeklyFrequency: data.weeklyFrequency.toString(),
        raceDate: data.raceDate?.toString(),
      },
    });
  };

  const { data: tests } = useSuspenseQuery({
    queryKey: ["tests"],
    queryFn: () => getUserRunningTests(),
  });
  const tabRefs = {
    progress: useRef<HTMLButtonElement>(null),
    statistics: useRef<HTMLButtonElement>(null),
    history: useRef<HTMLButtonElement>(null),
  };

  const handleClick = (tabKey: keyof typeof tabRefs) => {
    const el = tabRefs[tabKey]?.current;
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  };

  if (!tests.length) {
    return (
      <>
        <main className="py-4 md:py-8">
          <div className="px-4">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h1 className="text-3xl font-semibold tracking-tighter">
                  Testes de corrida
                </h1>
                <p className="text-muted-foreground">
                  Acompanhe seu desempenho e progresso na corrida ao longo do
                  tempo
                </p>
              </div>
              <Badge variant="secondary" className="text-sm">
                Nenhum teste registrado
              </Badge>
            </div>
            <Separator className="my-8" />
            <div className="mx-auto flex max-w-xl flex-col items-center">
              <h2 className="text-center text-2xl font-semibold tracking-tight">
                Nenhum teste registrado
              </h2>
              <p className="text-muted-foreground mt-4 text-center text-base">
                Você ainda não possui nenhum teste registrado. Registre seu
                primeiro teste de corrida para começar a acompanhar seu
                desempenho ao longo do tempo.
              </p>
              <ResponsiveDialog
                content={
                  <RunningTestForm
                    onSubmit={handleSubmit}
                    isLoading={isAddingTest}
                    isSuccess={isSuccess}
                  />
                }
                openDialog={isDialogOpen}
                setOpenDialog={setIsDialogOpen}
              >
                <Button variant="gradient" className="mt-6">
                  Registre seu primeiro teste
                </Button>
              </ResponsiveDialog>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <main className="py-4 md:py-8">
      <div className="px-4">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-semibold tracking-tighter">
              Testes de corrida
            </h1>
            <p className="text-muted-foreground">
              Acompanhe seu desempenho e progresso na corrida ao longo do tempo
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            {tests.length} testes completados
          </Badge>
        </div>
        <Suspense fallback={<TestsOverview.Loading className="mt-8" />}>
          <TestsOverview tests={tests} className="mt-8" />
        </Suspense>
      </div>
      <Tabs defaultValue="progress" className="mt-8 p-0">
        <TabsList className={CUSTOM_TABS_CLASSNAMES.list}>
          <div className="flex items-center">
            <TabsTrigger
              value="progress"
              className={CUSTOM_TABS_CLASSNAMES.trigger}
              ref={tabRefs.progress}
              onClick={() => handleClick("progress")}
            >
              <span className={CUSTOM_TABS_CLASSNAMES.innerSpan}>
                Gráficos de progresso
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="statistics"
              className={CUSTOM_TABS_CLASSNAMES.trigger}
              ref={tabRefs.statistics}
              onClick={() => handleClick("statistics")}
            >
              <span className={CUSTOM_TABS_CLASSNAMES.innerSpan}>
                Estatisticas gerais
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className={CUSTOM_TABS_CLASSNAMES.trigger}
              ref={tabRefs.history}
              onClick={() => handleClick("history")}
            >
              <span className={CUSTOM_TABS_CLASSNAMES.innerSpan}>
                Histórico de testes
              </span>
            </TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="progress" className="p-4">
          <Suspense fallback={<TestsCharts.Loading />}>
            <TestsCharts tests={tests} />
          </Suspense>
        </TabsContent>
        <TabsContent value="statistics" className="p-4">
          <Suspense fallback={<TestStats.Loading />}>
            <TestStats tests={tests} />
          </Suspense>
        </TabsContent>
        <TabsContent value="history" className="p-4">
          <Suspense fallback={<TestsTable.Loading />}>
            <TestsTable tests={tests} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </main>
  );
}
