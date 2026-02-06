import { zodResolver } from "@hookform/resolvers/zod";
import { Calculator, Heart } from "lucide-react";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { VDOTProgress } from "@/components/custom-vdot-progress";
import { DashboardCard } from "@/components/dashboard-card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhysiologyCalculator } from "@/features/vdot/physiology-calculator";
import {
  MAPPED_RACE_METERS_DISTANCE,
  MAPPED_RACE_MILES_DISTANCE,
  RACE_DISTANCE_KEYS,
  type RaceDistanceKey,
  raceTimesFallback,
  TEST_DISTANCE_MAPPING,
  zonesFallback,
} from "@/features/vdot/types";
import { CUSTOM_TABS_CLASSNAMES } from "@/lib/consts";
import { cn } from "@/lib/utils";
import { RaceEquivalentsTab } from "./race-equivalents-tab";
import { TrainingsTab } from "./trainings-tab";
import { TimeInput } from "@/components/time-input";
import { AnimatePresence } from "motion/react";
import { TimeValidation } from "@/components/time-validation";

const vdotSchema = z.object({
  duration: z
    .string()
    .regex(/^\d{2}:\d{2}:\d{2}$/, "Formato de duração inválido (HH:MM:SS)"),
  distance: z.string(),
});

type VdotFormData = z.infer<typeof vdotSchema>;

export function VDOTTabContent() {
  const form = useForm<VdotFormData>({
    resolver: zodResolver(vdotSchema),
    defaultValues: {
      duration: "00:00:00",
      distance: "",
    },
  });

  // // Watch duration and distance for pace calculation
  const duration = useWatch({ control: form.control, name: "duration" });
  const distance = useWatch({ control: form.control, name: "distance" });

  // Calculate pace in real time
  const calculatedPace = useMemo(() => {
    if (!duration || !distance) return "00:00";

    const distanceNum =
      MAPPED_RACE_METERS_DISTANCE[distance as RaceDistanceKey];
    if (!distanceNum || Number.isNaN(distanceNum) || distanceNum <= 0) return 0;

    const durationParts = duration.split(":");
    if (durationParts.length !== 3) return "00:00";
    const hours = parseInt(durationParts[0]);
    const minutes = parseInt(durationParts[1]);
    const seconds = parseInt(durationParts[2]);

    if (Number.isNaN(hours) || Number.isNaN(minutes) || Number.isNaN(seconds))
      return "00:00";

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (totalSeconds <= 0) return "00:00";

    // ✅ Corrigido: pace por km
    const distanceInKm = distanceNum / 1000;
    const paceInSeconds = totalSeconds / distanceInKm;

    const paceMinutes = Math.floor(paceInSeconds / 60);
    const paceSecondsRemainder = Math.floor(paceInSeconds % 60);

    const formattedPace = `${paceMinutes.toString().padStart(2, "0")}:${paceSecondsRemainder.toString().padStart(2, "0")}`;

    return formattedPace;
  }, [duration, distance]);

  // Calculate vo2max in real time
  const vo2MaxCalculated: number = useMemo(() => {
    if (!duration || !distance) return 0;

    const distanceNum =
      MAPPED_RACE_METERS_DISTANCE[distance as RaceDistanceKey];
    if (!distanceNum || Number.isNaN(distanceNum) || distanceNum <= 0) return 0;

    const durationParts = duration.split(":");
    if (durationParts.length !== 3) return 0;
    const hours = parseInt(durationParts[0]);
    const minutes = parseInt(durationParts[1]);
    const seconds = parseInt(durationParts[2]);

    if (Number.isNaN(hours) || Number.isNaN(minutes) || Number.isNaN(seconds))
      return 0;

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    const vo2Percentage = PhysiologyCalculator.calculateVDOTPercentage({
      timeInSeconds: totalSeconds,
    });
    const vo2Max = PhysiologyCalculator.calculateVDOT({
      distanceM: distanceNum,
      durationS: totalSeconds,
      VDOTPercentage: vo2Percentage,
    });

    return vo2Max;
  }, [duration, distance]);

  const raceTimes = useMemo(() => {
    if (!duration || !distance) return raceTimesFallback;

    const distanceNum = MAPPED_RACE_MILES_DISTANCE[distance as RaceDistanceKey];
    if (!distanceNum || Number.isNaN(distanceNum) || distanceNum <= 0)
      return raceTimesFallback;

    const durationParts = duration.split(":");
    if (durationParts.length !== 3) return raceTimesFallback;
    const hours = parseInt(durationParts[0]);
    const minutes = parseInt(durationParts[1]);
    const seconds = parseInt(durationParts[2]);

    if (Number.isNaN(hours) || Number.isNaN(minutes) || Number.isNaN(seconds))
      return raceTimesFallback;

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    return PhysiologyCalculator.getRacePaceProjections({
      durationS: totalSeconds,
      distanceMiles: distanceNum,
    });
  }, [duration, distance]);

  const minVO2 = 30;
  const maxVO2 = 85;

  const progress = ((vo2MaxCalculated - minVO2) / (maxVO2 - minVO2)) * 100;

  const paceSegments = useMemo(() => {
    if (!duration || !distance) return zonesFallback;

    const distanceNum =
      MAPPED_RACE_METERS_DISTANCE[distance as RaceDistanceKey];
    if (!distanceNum || Number.isNaN(distanceNum) || distanceNum <= 0)
      return zonesFallback;

    const durationParts = duration.split(":");
    if (durationParts.length !== 3) return zonesFallback;
    const hours = parseInt(durationParts[0]);
    const minutes = parseInt(durationParts[1]);
    const seconds = parseInt(durationParts[2]);

    if (Number.isNaN(hours) || Number.isNaN(minutes) || Number.isNaN(seconds))
      return zonesFallback;

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    return PhysiologyCalculator.getTrainingsPace({
      durationS: totalSeconds,
      distanceM: distanceNum,
    });
  }, [duration, distance]);

  return (
    <div className='divide-border flex flex-col gap-4 lg:flex-row lg:items-start'>
      <DashboardCard
        className='flex-1/2 w-full max-w-2xl md:sticky md:top-6 lg:shrink-0'
        title='Calculadora VDOT'
        contentClassName='space-y-4'
        footerVariant='warning'
        icon={Calculator}
        footerContent={
          <span className='text-sm'>
            Esses dados serão utilizados para o calculo do seu VDOT
          </span>
        }
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => { })}>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='distance'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distancia</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Selecione uma distancia' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {RACE_DISTANCE_KEYS.toReversed().map((distance) => (
                          <SelectItem key={distance} value={distance}>
                            {TEST_DISTANCE_MAPPING[distance]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='duration'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempo gasto (hh:mm:ss)</FormLabel>
                    <FormControl>
                      <TimeInput
                        format='long'
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        placeholder='00:00:00'
                        inputMode='numeric'
                      />
                    </FormControl>
                    {duration && (
                      <AnimatePresence mode='wait' initial={false}>
                        <TimeValidation time={duration} format={"long"} />
                      </AnimatePresence>
                    )}
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <div className='bg-muted rounded-lg p-4'>
          <p className='text-muted-foreground mb-1 text-sm font-medium'>
            Pace Calculado
          </p>
          <div className='text-2xl font-bold'>{calculatedPace} min/km</div>
        </div>
      </DashboardCard>
      <div className='w-full'>
        <h2 className='text-xl font-medium md:text-3xl'>Seu resultado:</h2>
        <div className='mt-8 flex flex-col gap-2'>
          <span className='text-foreground text-base'>Vo2 Máximo</span>
          <div className='relative h-10 overflow-hidden rounded-md'>
            <VDOTProgress value={progress} className='h-full rounded-md' />
            <span className='absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-x-2 text-sm'>
              <Heart />
              {Math.round(vo2MaxCalculated)} ml/kg/min
            </span>
          </div>
        </div>
        <Separator className='my-8' />
        <Tabs defaultValue='equivalents'>
          <TabsList className={cn(CUSTOM_TABS_CLASSNAMES.list, "px-0")}>
            <TabsTrigger
              value='equivalents'
              className={CUSTOM_TABS_CLASSNAMES.trigger}
            >
              <span className={CUSTOM_TABS_CLASSNAMES.innerSpan}>
                Equivalentes
              </span>
            </TabsTrigger>
            <TabsTrigger
              value='training'
              className={CUSTOM_TABS_CLASSNAMES.trigger}
            >
              <span className={CUSTOM_TABS_CLASSNAMES.innerSpan}>
                Treinamento
              </span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value='training' className='pt-3'>
            <TrainingsTab trainings={paceSegments} />
          </TabsContent>
          <TabsContent value='equivalents' className='pt-3'>
            <RaceEquivalentsTab raceTimes={raceTimes} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
