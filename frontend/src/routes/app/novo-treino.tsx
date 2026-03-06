import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatInTimeZone } from "date-fns-tz";
import {
  CalendarIcon,
  Goal,
  Layers,
  Loader,
  PenLine,
  Save,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { DashboardCard } from "@/components/dashboard-card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { createCustomWorkout } from "@/features/trainings/api/create-custom-workout";
import { getUserPlanning } from "@/features/trainings/api/get-user-planning";
import { BlockForm } from "@/features/trainings/components/workouts/block-form";
import { SegmentForm } from "@/features/trainings/components/workouts/segment-form";
import { useConfirm } from "@/hooks/use-confirm";
import { cn } from "@/lib/utils";
import { trainingTypes } from "@/shared/constants/training.constants";
import { type WorkoutFormData, workoutSchema } from "@/shared/schemas";
import { RUN_TYPE_MAPPING } from "@/lib/consts";

export const Route = createFileRoute("/app/novo-treino")({
  component: RouteComponent,
});

function RouteComponent() {
  const [DuplicateWorkoutDialog, confirm] = useConfirm({
    title: "Treino duplicado",
    message: "Você já possui um treino para essa data. Deseja sobreescrever?",
    variant: "default",
    buttonCopy: {
      idle: "Salvar treino",
      loading: <Loader className='mr-2 h-4 w-4 animate-spin' />,
    },
  });
  const form = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      scheduledStart: new Date(),
      runType: "EASY_RUN",
      title: "",
      notes: "",
      duration: "00:00:00",
      segments: [],
      blocks: [],
    },
  });

  const { mutate, isPending } = createCustomWorkout();
  const { data: workouts } = useQuery({
    queryKey: ["workouts"],
    queryFn: () => getUserPlanning(),
  });

  async function onSubmit(data: WorkoutFormData) {
    const newWorkoutDate = formatInTimeZone(
      data.scheduledStart,
      "UTC",
      "yyyy-MM-dd",
    );

    const existingWorkout = workouts
      ?.flatMap((w) => w.workouts)
      .find(
        (w) =>
          formatInTimeZone(w.scheduledStart, "UTC", "yyyy-MM-dd") ===
          newWorkoutDate,
      );

    if (existingWorkout) {
      const ok = await confirm();

      if (!ok) {
        return;
      }
      mutate({
        json: {
          runType: data.runType,
          title: data.title,
          notes: data.notes,
          scheduledStart: data.scheduledStart,
          duration: data.duration,
          segments: data.segments ? data.segments : [],
          blocks: data.blocks ? data.blocks : [],
          plannedDistanceM: data.plannedDistanceM,
        },
      });
    } else {
      mutate({
        json: {
          runType: data.runType,
          title: data.title,
          notes: data.notes,
          scheduledStart: data.scheduledStart,
          duration: data.duration,
          segments: data.segments ? data.segments : [],
          blocks: data.blocks ? data.blocks : [],
          plannedDistanceM: data.plannedDistanceM,
        },
      });
    }
  }

  return (
    <>
      <DuplicateWorkoutDialog />
      <div className='container mx-auto max-w-4xl px-2 py-4 md:py-6'>
        <div className='mb-8'>
          <h1 className='text-3xl font-semibold tracking-tight'>
            Crie um novo treino
          </h1>
          <p className='text-muted-foreground'>
            Projete sua sessão de treinamento com blocos e segmentos
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Basic information */}
            <DashboardCard
              title='Informações iniciais'
              description='Configure os detalhes fundamentais de seu treino'
              icon={PenLine}
              contentClassName='space-y-6'
            >
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do treino</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Treino intervalado matinal'
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='runType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de treino</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Selecione o tipo de treino' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {trainingTypes.map((option) => (
                            <SelectItem key={option} value={option}>
                              {RUN_TYPE_MAPPING[option]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='scheduledStart'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Data do treino</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            type='button'
                            variant='outline'
                            className={cn(
                              "w-[280px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='notes'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas adicionais</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Adicione notas adicionais sobre este treino'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </DashboardCard>
            <DashboardCard
              title='Planejamento'
              description='Configure os detalhes fundamentais de seu treino'
              icon={Goal}
            >
              <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                <FormField
                  control={form.control}
                  name='plannedDistanceM'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distância (m)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='5000'
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number.parseInt(e.target.value)
                                : undefined,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='duration'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração</FormLabel>
                      <FormControl>
                        <Input
                          step='1'
                          placeholder='00:00:00'
                          className='appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
                          type='time'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='elevationGainM'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Elevação (m)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='100'
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number.parseInt(e.target.value)
                                : undefined,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </DashboardCard>
            {/* Workout Structure */}
            <DashboardCard
              title='Estrutura do treino'
              description='Escolha entre blocos estruturados (para treinamento
                  intervalado) ou segmentos individuais'
              icon={Layers}
            >
              <Tabs defaultValue='blocks'>
                <TabsList className='grid w-full grid-cols-2'>
                  <TabsTrigger value='blocks'>Blocos estruturados</TabsTrigger>
                  <TabsTrigger value='segments'>
                    Segmentos individuais
                  </TabsTrigger>
                </TabsList>

                <TabsContent value='blocks' className='mt-6'>
                  <BlockForm />
                </TabsContent>

                <TabsContent value='segments' className='mt-6'>
                  <SegmentForm />
                </TabsContent>
              </Tabs>
            </DashboardCard>
            {/* Submit Buttons */}
            <div className='flex justify-end gap-4'>
              <Button type='button' variant='outline'>
                Salvar como rascunho
              </Button>
              <Button type='submit' variant='gradient' disabled={isPending}>
                <Save className='mr-2 h-4 w-4' />
                Criar treino
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
