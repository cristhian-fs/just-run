import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useWorkoutSheetStore } from "@/features/trainings/store/workout-sheet-store";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AnimatePresence, motion, type Variants } from "motion/react";

import { RegisterWorkoutFormData } from "@/shared/schemas";
import { userQueryOptions } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ResponsiveSheet } from "@/components/responsive-sheet";

import { getWorkout } from "../../api/get-workout";
import { useRegisterWorkout } from "../../api/use-register-workout";
import { RegisterWorkoutForm } from "./register-workout-form";
import { WorkoutData } from "./workout-sheet-data";

export interface WorkoutSheetProps {
  isOpen: boolean;
}

const containerVariant = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      ease: "easeInOut",
      duration: 0.2,
    },
  },
} as Variants;

export const WorkoutSheet = ({ isOpen = true }: WorkoutSheetProps) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const { data: user } = useQuery(userQueryOptions());
  if (!user) {
    return null;
  }

  const state = useWorkoutSheetStore();
  const { workoutId } = state;

  const { data: workout, isLoading: isLoadingWorkout } = useQuery({
    queryKey: ["workout", workoutId],
    queryFn: () =>
      getWorkout({ userId: user.id, workoutId: workoutId as string }),
  });

  const { mutate: registerWorkout, isPending: isRegisteringWorkout } =
    useRegisterWorkout({
      workoutId: workout?.id || "",
    });

  if (isLoadingWorkout) {
    return (
      <ResponsiveSheet
        openSheet={isOpen}
        setOpenSheet={(open) => useWorkoutSheetStore.setState({ isOpen: open })}
        sheetContentClassName="sm:max-w-2xl"
        content={
          <>
            <SheetHeader>
              <SheetTitle className="text-lg sm:text-xl">
                Carregando treino...
              </SheetTitle>
            </SheetHeader>
            <Separator />
            <WorkoutData.Loading />
          </>
        }
      />
    );
  }

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

  const handleRegisterWorkout = (values: RegisterWorkoutFormData) => {
    registerWorkout({
      param: { userId: user.id, workoutId: workout.id },
      form: {
        date: values.date.toISOString(),
        time: values.time,
        runType: values.runType,
        workoutType: values.workoutType,
        duration: values.duration,
        distance: values.distance,
        perceivedEffort: values.perceivedEffort,
      },
    });
    setIsRegistering(false);
  };

  const workoutData = {
    ...workout,
    createdAt: parseISO(workout?.createdAt as string),
    updatedAt: parseISO(workout?.updatedAt as string),
  };

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
            {!workout.isCompleted ? (
              <motion.div
                initial={{ scale: 1 }}
                whileTap={{ scale: 0.97 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  ease: "easeInOut",
                }}
              >
                <Button
                  variant={isRegistering ? "destructive" : "secondary"}
                  className="mt-2 w-full"
                  onClick={() => setIsRegistering(!isRegistering)}
                >
                  {isRegistering ? "Cancelar Registro" : "Registrar treino"}
                </Button>
              </motion.div>
            ) : (
              <Button className="mt-2 w-full" disabled>
                Treino concluido
              </Button>
            )}
          </SheetHeader>
          <Separator />
          <AnimatePresence mode="wait">
            {isRegistering ? (
              <>
                <motion.div
                  key="registering"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="custom-scrollbar space-y-4 overflow-y-auto p-4"
                >
                  <RegisterWorkoutForm
                    runType={workout.runType}
                    onSubmit={handleRegisterWorkout}
                    isRegistering={isRegisteringWorkout}
                  />
                </motion.div>
              </>
            ) : (
              <>
                <motion.div
                  key="details"
                  variants={containerVariant}
                  initial="hidden"
                  animate="show"
                  className="custom-scrollbar space-y-4 overflow-y-auto"
                >
                  <WorkoutData workout={workoutData} />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      }
    />
  );
};
