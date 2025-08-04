import { useTrainingDialogStore } from "@/features/vdot/store/training-dialog-store";
import { HeartRaceZone, VDOTTrainingSegmentType } from "@/features/vdot/types";

import { Button } from "@/components/ui/button";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ResponsiveDialog } from "@/components/responsive-dialog";

type TTrainingDialogContent = {
  title: string;
  variety: string;
  purpose: string;
  sampleWorkout: string;
};

const TRAINING_DIALOG_CONTENT: Partial<
  Record<HeartRaceZone | VDOTTrainingSegmentType, TTrainingDialogContent>
> = {
  "Easy Aerobic Zone": {
    title: "Corrida fácil",
    variety:
      "A corrida fácil inclui aquecimentos, desaquecimentos, corridas de recuperação (dentro ou fora de treinos) e geralmente treinos longos.",
    purpose:
      "Correr nesse ritmo promove benefícios fisiológicos que constroem uma base sólida para treinos de maior intensidade. O coração se fortalece, os músculos recebem mais sangue e aumentam sua capacidade de usar o oxigênio entregue pelo sistema cardiovascular.",
    sampleWorkout: "30-45 minutos em ritmo fácil",
  },
  Marathon: {
    title: "Maratona",
    variety: "Corrida contínua ou repetições longas.",
    purpose:
      "Usado para simular as condições de ritmo de prova para quem treina para maratona ou como alternativa ao ritmo fácil em treinos longos de corredores iniciantes.",
    sampleWorkout: "10 minutos fácil, 60-90 minutos ritmo de maratona",
  },
  THRESHOLD: {
    title: "Limiar de lactato",
    variety:
      "Corridas contínuas e prolongadas (tempos runs) ou corridas com intervalos (cruise intervals).",
    purpose: "Melhorar a resistência.",
    sampleWorkout:
      "3 x 1 milha em ritmo de limiar (1 min pausa) ou 20 minutos contínuos",
  },
  INTERVAL: {
    title: "Intervalado",
    variety: "Intervalos de VO2max.",
    purpose:
      "Estimular a potência aeróbica (VO2max). Cada intervalo dura 3–5 minutos para atingir e manter a intensidade correta sem envolver demais o sistema anaeróbico.",
    sampleWorkout:
      "6 x 2 minutos (1 min trote), 5 x 3 minutos (2 min trote), 4 x 4 minutos (3 min trote)",
  },
  REPETITION: {
    title: "Repetições",
    variety: "Repetições em ritmo de prova e strides.",
    purpose:
      "Melhorar a velocidade e economia de corrida. Repetições devem ser rápidas, mas com pausas suficientes para manter a forma relaxada e eficiente.",
    sampleWorkout: "8 x 200m (200m trote) ou 4 x 400m (400m trote)",
  },
};

export function TrainingsDialog() {
  const { isOpen, setIsOpen, trainingType } = useTrainingDialogStore();

  if (!trainingType) return null;

  const trainingContent = TRAINING_DIALOG_CONTENT[trainingType];

  if (trainingContent) {
    return (
      <ResponsiveDialog
        openDialog={isOpen}
        setOpenDialog={setIsOpen}
        dialogContentClassName="p-0 gap-0"
        content={
          <>
            <DialogHeader className="p-6">
              <DialogTitle>{trainingContent.title}</DialogTitle>
            </DialogHeader>
            <div className="text-muted-foreground space-y-4 px-6 pb-6 text-sm lg:text-base">
              <p>
                <span className="text-foreground font-semibold">
                  Variações:{" "}
                </span>
                {trainingContent.variety}
              </p>
              <p>
                <span className="text-foreground font-semibold">
                  Propósito:{" "}
                </span>
                {trainingContent.purpose}
              </p>
              <p>
                <span className="text-foreground font-semibold">
                  Treino exemplo:{" "}
                </span>
                {trainingContent.sampleWorkout}
              </p>
            </div>
            <DialogFooter className="border-border bg-secondary/25 dark:bg-secondary/50 justify-end border-t px-6 pb-4 pt-4">
              <Button
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Entendi!
              </Button>
            </DialogFooter>
          </>
        }
      />
    );
  }

  return null;
}
