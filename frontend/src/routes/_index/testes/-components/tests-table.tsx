import { deleteUserRunningTest } from "@/features/running-tests/api/delete-user-running-test";
import { History, Loader, Trash } from "lucide-react";

import { Test } from "@/shared/types";
import { useConfirm } from "@/hooks/use-confirm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardCard } from "@/components/dashboard-card";

interface TestsTableProps {
  tests: Test[];
}

export function TestsTable({ tests }: TestsTableProps) {
  const [DeleteDialog, deleteTest] = useConfirm({
    buttonCopy: {
      idle: "Excluir",
      loading: <Loader size={16} color="rgba(255, 255, 255, 0.65)" />,
    },
    title: "Excluir teste",
    message: "Teste excluido com sucesso",
    variant: "destructive",
  });

  const { mutate } = deleteUserRunningTest();

  const handleDelete = async (id: string) => {
    const ok = await deleteTest();

    if (!ok) return;

    mutate({ param: { id } });
  };

  // Sort tests by date (most recent first)
  const sortedTests = tests.sort(
    (a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime(),
  );

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getTestTypeBadgeColor = (testType: string) => {
    const colors = {
      "1600m": "bg-blue-100 text-blue-800",
      "2400m": "bg-green-100 text-green-800",
      "3200m": "bg-yellow-100 text-yellow-800",
      "3000m": "bg-purple-100 text-purple-800",
      "5000m": "bg-red-100 text-red-800",
    };
    return (
      colors[testType as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  return (
    <>
      <DeleteDialog />
      <DashboardCard
        title="Historico de testes"
        description="O histórico completo de todos os seus testes de treino."
        icon={History}
      >
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Tipo de teste</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Pace</TableHead>
                <TableHead>VO2 Máximo</TableHead>
                <TableHead>VAM (velocidade aerobica maxima)</TableHead>
                <TableHead>FC Máximo</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">
                    {new Date(test.testDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getTestTypeBadgeColor(test.testType)}
                    >
                      {test.testType}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDuration(test.durationS)}</TableCell>
                  <TableCell>
                    {test.paceMinKm ? (
                      <span className="font-mono">{test.paceMinKm}/km</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {test.vo2Max ? (
                      <span>{test.vo2Max.toFixed(1)} ml/kg/min</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {test.vam ? (
                      <span>{test.vam.toFixed(1)} km/h</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {test.fcmax ? (
                      <span>{test.fcmax} bpm</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-x-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="hover:bg-destructive hover:text-destructive-foreground dark:hover:bg-destructive dark:hover:text-destructive-foreground"
                        onClick={() => handleDelete(test.id)}
                      >
                        <Trash className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DashboardCard>
    </>
  );
}

TestsTable.Loading = function TestsTableLoading() {
  return (
    <DashboardCard
      title="Historico de testes"
      description="O histórico completo de todos os seus testes de treino."
      icon={History}
    >
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Tipo de teste</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead>Pace</TableHead>
              <TableHead>VO2 Máximo</TableHead>
              <TableHead>VAM (velocidade aerobica maxima)</TableHead>
              <TableHead>FC Máximo</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24" />
                </TableCell>
                <TableCell>
                  {" "}
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardCard>
  );
};
