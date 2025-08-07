import { RaceTime, TEST_DISTANCE_MAPPING } from "@/features/vdot/types";
import { Info } from "lucide-react";

import { formatSecondsToHHMMSS } from "@/lib/calculations";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RaceEquivalentsTabProps {
  raceTimes: RaceTime[];
}

export function RaceEquivalentsTab({ raceTimes }: RaceEquivalentsTabProps) {
  return (
    <div className="space-y-8">
      <div className="bg-muted text-muted-foreground flex items-center gap-x-2 rounded-md border px-4 py-2">
        <Info className="size-4 shrink-0" />
        <span>
          Esta guia mostra os desempenhos equivalentes na corrida para o tempo
          que você inseriu.
        </span>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-0 hover:bg-transparent dark:hover:bg-transparent">
            <TableHead className="px-3">Tipo</TableHead>
            <TableHead className="px-3">Tempo total</TableHead>
            <TableHead className="px-3">Pace (minutos/km)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {raceTimes.map((training) => (
            <TableRow
              key={training.race}
              className="odd:hover:bg-muted/90 dark:odd:hover:bg-muted/90 dark:odd:bg-muted/90 rounded-md border-0 hover:bg-transparent dark:hover:bg-transparent"
            >
              <TableCell className="px-3 py-4">
                {TEST_DISTANCE_MAPPING[training.race]}
              </TableCell>
              <TableCell className="px-3 py-4">
                {formatSecondsToHHMMSS(training.time)}
              </TableCell>
              <TableCell className="px-3 py-4">
                {training.pace} min/km
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
