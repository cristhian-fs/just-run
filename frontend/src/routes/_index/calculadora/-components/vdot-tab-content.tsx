import { useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calculator, Heart } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  calculateRacePaces,
  calculateVDOT,
  getPacesPerSegment,
} from "@/lib/calculations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { VDOTProgress } from "@/components/custom-vdot-progress";
import { DashboardCard } from "@/components/dashboard-card";

import { SegmentPace, zonesFallback } from "./types";

// Test distances in meters
const testDistances = {
  "1500m": 1500,
  mile: 1609.344,
  "3k": 3000,
  "5k": 5000,
  "10k": 10000,
  "15k": 15000,
  "10mile": 16093.44,
  half: 21097.5,
  marathon: 42195,
};

const testDistancesList = Object.keys(testDistances);
type TTestDistance = keyof typeof testDistances;

const TEST_DISTANCE_MAPPING = {
  "1500m": "1500m",
  mile: "1 milha",
  "3k": "3km",
  "5k": "5km",
  "10k": "10km",
  "15k": "15km",
  "10mile": "10 milhas",
  half: "Meia maratona",
  marathon: "Maratona",
};

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

    const distanceNum = testDistances[distance as TTestDistance];
    if (isNaN(distanceNum) || distanceNum <= 0) return "00:00";

    const durationParts = duration.split(":");
    if (durationParts.length !== 3) return "00:00";
    const hours = parseInt(durationParts[0]);
    const minutes = parseInt(durationParts[1]);
    const seconds = parseInt(durationParts[2]);

    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return "00:00";

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

    const distanceNum = testDistances[distance as TTestDistance];
    if (isNaN(distanceNum) || distanceNum <= 0) return 0;

    const durationParts = duration.split(":");
    if (durationParts.length !== 3) return 0;
    const hours = parseInt(durationParts[0]);
    const minutes = parseInt(durationParts[1]);
    const seconds = parseInt(durationParts[2]);

    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return 0;

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    const vo2Max = calculateVDOT({
      distanceM: distanceNum,
      durationS: totalSeconds,
    });

    return vo2Max;
  }, [duration, distance]);

  const raceTimes = useMemo(
    () => calculateRacePaces(vo2MaxCalculated),
    [vo2MaxCalculated],
  );

  const minVO2 = 30;
  const maxVO2 = 85;

  const progress = ((vo2MaxCalculated - minVO2) / (maxVO2 - minVO2)) * 100;

  const paceSegments: SegmentPace[] = useMemo(() => {
    if (!duration || !distance) return zonesFallback;

    const distanceNum = testDistances[distance as TTestDistance];
    if (isNaN(distanceNum) || distanceNum <= 0) return zonesFallback;

    const durationParts = duration.split(":");
    if (durationParts.length !== 3) return zonesFallback;
    const hours = parseInt(durationParts[0]);
    const minutes = parseInt(durationParts[1]);
    const seconds = parseInt(durationParts[2]);

    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return zonesFallback;

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    return getPacesPerSegment(
      calculateVDOT({ distanceM: distanceNum, durationS: totalSeconds }),
    );
  }, [duration, distance]);

  return (
    <div className="divide-border flex flex-col gap-4 md:flex-row md:items-start">
      <DashboardCard
        className="flex-1/2 w-full max-w-2xl md:sticky md:top-6 lg:shrink-0"
        title="Calculadora VDOT"
        contentClassName="space-y-4"
        footerVariant="warning"
        icon={Calculator}
        footerContent={
          <span className="text-sm">
            Esses dados serão utilizados para o calculo do seu VDOT
          </span>
        }
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {})}>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="distance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distancia</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione uma distancia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {testDistancesList.map((distance) => (
                          <SelectItem key={distance} value={distance}>
                            {TEST_DISTANCE_MAPPING[distance as TTestDistance]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração da corrida</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        step="1"
                        className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        placeholder="00:00:00"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <div className="bg-muted rounded-lg p-4">
          <p className="text-muted-foreground mb-1 text-sm font-medium">
            Pace Calculado
          </p>
          <div className="text-2xl font-bold">{calculatedPace} min/km</div>
        </div>
      </DashboardCard>
      <div className="w-full">
        <h2 className="text-xl font-medium md:text-3xl">Seu resultado:</h2>
        <div className="mt-8 flex flex-col gap-2">
          <span className="text-foreground text-base">Vo2 Máximo</span>
          <div className="relative h-10 overflow-hidden rounded-md">
            <VDOTProgress value={progress} className="h-full rounded-md" />
            <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-x-2 text-sm">
              <Heart />
              {Math.round(vo2MaxCalculated)} ml/kg/min
            </span>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col gap-4">
          <span className="text-foreground text-base">
            Seus ritmos de treinamento estimados:
          </span>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {paceSegments.map((segment) => (
              <Card key={segment.name} className="gap-2">
                <CardHeader>
                  <CardTitle>{segment.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {segment.paceInterval} min/km
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col gap-4">
          <span className="text-foreground text-base">
            Ritmos de prova estimados:
          </span>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {raceTimes.map((race) => (
              <Card key={race.name} className="gap-2">
                <CardHeader>
                  <CardTitle>{race.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{race.pace} min/km</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
