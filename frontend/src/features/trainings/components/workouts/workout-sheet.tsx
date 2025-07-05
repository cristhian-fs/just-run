import { useWorkoutSheetStore } from "@/features/trainings/store/workout-sheet-store";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BadgeCheck, Clock, FlagIcon } from "lucide-react";

import {
  BlockSelect,
  SegmentSelect,
  TSegmentKind,
  WorkoutSelect,
} from "@/shared/types";
import { secondsToPace } from "@/lib/calculations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ResponsiveSheet } from "@/components/responsive-sheet";

import { RunTypeBadge } from "../run-type-badge";
import { RUN_TYPE_MAPPING } from "./workout-card";

/** BlockSelect enriquecido com seus segmentos */
type BlockWithSegments = BlockSelect & {
  segments: SegmentSelect[];
};

/** WorkoutSelect enriquecido com seus blocos */
type WorkoutWithBlocks = WorkoutSelect & {
  blocks: BlockWithSegments[];
};

export interface WorkoutSheetProps {
  workout?: WorkoutWithBlocks; // ← agora tem blocks → segments
  isOpen: boolean;
}

const formatDistance = (meters: number | null) => {
  if (!meters) return "N/A";
  return (meters / 1000).toFixed(2) + " km";
};

const formatDuration = (seconds: number | null) => {
  if (!seconds) return "N/A";
  return Math.round(seconds / 60) + " min";
};

const getSegmentKindLabel = (kind: TSegmentKind) => {
  const kinds: Record<TSegmentKind, string> = {
    WARMUP: "Aquecimento",
    WORK: "Trabalho",
    REST: "Descanso",
    COOLDOWN: "Desaquecimento",
    FLOAT: "Trote leve",
    PROGRESSIVE: "Progressivo",
    THRESHOLD: "Em ritmo de limiar",
  };
  return kinds[kind] || kind;
};

const getSegmentKindColor = (kind: string) => {
  const colors: Record<string, string> = {
    WARMUP: "bg-blue-100 text-blue-800",
    WORK: "bg-red-100 text-red-800",
    REST: "bg-green-100 text-green-800",
    COOLDOWN: "bg-purple-100 text-purple-800",
  };
  return colors[kind] || "bg-gray-100 text-gray-800";
};

export const WorkoutSheet = ({ isOpen = true, workout }: WorkoutSheetProps) => {
  if (!workout) {
    return (
      <ResponsiveSheet
        openSheet={isOpen}
        setOpenSheet={(open) => useWorkoutSheetStore.setState({ isOpen: open })}
        sheetContentClassName="sm:max-w-2xl"
        content={
          <>
            <SheetHeader className="pt-8">
              <SheetTitle className="text-lg sm:text-xl">
                Nenhum treino foi selecionado
              </SheetTitle>
            </SheetHeader>
            <Separator />
          </>
        }
      />
    );
  }

  return (
    <ResponsiveSheet
      openSheet={isOpen}
      setOpenSheet={(open) => useWorkoutSheetStore.setState({ isOpen: open })}
      sheetContentClassName="gap-0 sm:max-w-2xl"
      content={
        <>
          <SheetHeader className="pt-8">
            <SheetTitle className="text-lg sm:text-xl">
              {workout.title}
            </SheetTitle>
            <p className="text-muted-foreground">
              {format(workout.scheduledStart, "EEEE',' dd 'de' MMMM", {
                locale: ptBR,
              })}
            </p>
            <Button variant="secondary" className="mt-2 w-full" size="default">
              Registrar treino
            </Button>
          </SheetHeader>
          <Separator />
          <div className="space-y-4 p-4">
            <p className="text-foreground text-base font-medium sm:text-lg">
              Detalhes do treino
            </p>
            <ul className="space-y-5">
              <li className="flex items-center">
                <Clock className="text-muted-foreground size-4" />
                <p className="text-muted-foreground ml-2 text-sm sm:text-base">
                  Tipo de treino:
                </p>
                <RunTypeBadge variant={workout.runType} className="ml-2">
                  {RUN_TYPE_MAPPING[workout.runType]}
                </RunTypeBadge>
              </li>
              <li className="flex items-center">
                <Clock className="text-muted-foreground size-4" />
                <p className="text-muted-foreground ml-2 text-sm sm:text-base">
                  Duração:
                </p>
                {workout.plannedDurationS ? (
                  <p className="ml-2 text-sm sm:text-base">
                    {Math.round(workout.plannedDurationS / 60)} min
                  </p>
                ) : (
                  <p className="ml-2 text-sm sm:text-base">N/A</p>
                )}
              </li>
              <li className="flex items-center">
                <FlagIcon className="text-muted-foreground size-4" />
                <p className="text-muted-foreground ml-2 text-sm sm:text-base">
                  Distância:
                </p>
                {workout.plannedDistanceM ? (
                  <p className="ml-2 text-sm sm:text-base">
                    ~{Math.round(workout.plannedDistanceM / 1000)} km
                  </p>
                ) : (
                  <p className="ml-2 text-sm sm:text-base">N/A</p>
                )}
              </li>
              <li className="flex items-center">
                <BadgeCheck className="text-muted-foreground size-4" />
                <p className="text-muted-foreground ml-2 text-sm sm:text-base">
                  Status:
                </p>
                {workout.isCompleted ? (
                  <Badge className="ml-2 border-green-500 bg-green-500/5 dark:bg-green-500/10">
                    <span className="text-sm text-green-600 dark:text-green-400">
                      Concluido
                    </span>
                  </Badge>
                ) : (
                  <Badge className="ml-2 border-red-500 bg-red-500/5 dark:bg-red-500/10">
                    <span className="text-sm text-red-600 dark:text-red-400">
                      Não concluido
                    </span>
                  </Badge>
                )}
              </li>
            </ul>
          </div>
          <Separator />
          {/* Blocks and Segments */}
          <div className="custom-scrollbar h-full space-y-4 overflow-y-auto p-4">
            <h3 className="text-lg font-semibold">Estrutura do Treino</h3>
            {workout.blocks.map((block) => (
              <Card key={block.id} className="gap-2">
                <CardHeader className="">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      Bloco {block.orderIndex} - {block.description}
                    </CardTitle>
                    <Badge variant="outline">{block.repeatCount}x</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {block.segments.map((segment) => (
                      <div key={segment.id} className="rounded-lg border p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <Badge
                            className={getSegmentKindColor(segment.segmentKind)}
                          >
                            {getSegmentKindLabel(segment.segmentKind)}
                          </Badge>
                          <span className="text-muted-foreground text-sm">
                            Segmento {segment.orderInBlock}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                          <div>
                            <p className="text-muted-foreground">Distância</p>
                            <p className="font-medium">
                              {formatDistance(segment.plannedDistanceM)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Pace Alvo</p>
                            <p className="font-medium">
                              {segment.targetPaceSPerKm &&
                                secondsToPace(segment.targetPaceSPerKm || 0) +
                                  "/km"}
                              {!segment.targetPaceSPerKm && "Pace não definido"}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Duração</p>
                            <p className="font-medium">
                              {formatDuration(segment.plannedDurationS)}
                            </p>
                          </div>
                        </div>

                        {segment.notes && (
                          <div className="bg-muted mt-3 rounded p-2 px-3 text-sm">
                            {segment.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      }
    />
  );
};
