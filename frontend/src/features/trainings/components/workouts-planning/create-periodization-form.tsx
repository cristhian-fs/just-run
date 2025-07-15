import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, CircleQuestionMark, Loader } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useForm, useWatch } from "react-hook-form";

import { raceOptions } from "@/shared/constants/training.constants";
import {
  NewPeriodizationPlanFormData,
  newPeriodizationPlanSchema,
} from "@/shared/schemas";
import { RaceOption } from "@/shared/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Hint } from "@/components/hint";

const BASE_VOLUME_RECOMENDATION: Record<
  RaceOption,
  { MINUTES: number; KM: number }
> = {
  "5K": {
    MINUTES: 200,
    KM: 25,
  },
  "10K": {
    MINUTES: 240,
    KM: 40,
  },
  "21K": {
    MINUTES: 300,
    KM: 60,
  },
  "42K": {
    MINUTES: 420,
    KM: 80,
  },
};

const buttonCopy = {
  idle: "Criar Plano de Periodização",
  loading: <Loader size={16} color="rgba(255, 255, 255, 0.65)" />,
  success: "Plano criado com sucesso!",
};

interface CreatePeriodizationFormProps {
  handleSubmit: (data: NewPeriodizationPlanFormData) => void;
  isCreating: boolean;
  isSuccess: boolean;
}

export function CreatePeriodizationForm({
  handleSubmit,
  isCreating,
  isSuccess,
}: CreatePeriodizationFormProps) {
  const form = useForm<NewPeriodizationPlanFormData>({
    resolver: zodResolver(newPeriodizationPlanSchema),
  });

  const [buttonState, setButtonState] = useState<
    "idle" | "loading" | "success"
  >("idle");

  const race = useWatch({ control: form.control, name: "race" });
  const unit = useWatch({ control: form.control, name: "unit" });

  const volumeRecomendation =
    unit && race
      ? BASE_VOLUME_RECOMENDATION[race][unit]
      : 0 + " " + (unit === "KM" ? "kms" : "minutos");

  useEffect(() => {
    if (isCreating) {
      setButtonState("loading");
    } else if (isSuccess) {
      setButtonState("success");

      const timeout = setTimeout(() => {
        setButtonState("idle");
      }, 3000);
      return () => clearTimeout(timeout);
    } else {
      setButtonState("idle");
    }
  }, [isCreating, isSuccess]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="">
        {/* Weeks */}
        <div className="space-y-6 p-6 pt-0">
          <FormField
            control={form.control}
            name="weeks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Semanas</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Quantas semanas" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="8">8 semanas</SelectItem>
                      <SelectItem value="12">12 semanas</SelectItem>
                      <SelectItem value="16">16 semanas</SelectItem>
                      <SelectItem value="20">20 semanas</SelectItem>
                      <SelectItem value="24">24 semanas</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Duração total do plano de treinamento
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Race Type */}
          <FormField
            control={form.control}
            name="race"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Prova</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o tipo de prova" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {raceOptions.map((race) => (
                      <SelectItem key={race} value={race}>
                        {race}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Prova alvo para o seu treinamento
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Weekly Frequency and Unit */}
          <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="weeklyFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantos dias da semana treina?</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Dias da semana" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="3">3 dias</SelectItem>
                      <SelectItem value="4">4 dias</SelectItem>
                      <SelectItem value="5">5 dias</SelectItem>
                      <SelectItem value="6">6 dias</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidade de Medida</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a unidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="KM">Quilômetros (KM)</SelectItem>
                      <SelectItem value="MINUTES">Minutos</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Base Value Per Week */}
          <FormField
            control={form.control}
            name="baseValuePerWeek"
            render={({ field }) => (
              <FormItem>
                <div className="inline-flex gap-x-2">
                  <FormLabel>Volume Base por Semana</FormLabel>
                  <Hint
                    side="top"
                    description={`Recomendação com base na prova e unidade de medida: ${volumeRecomendation}`}
                  >
                    <CircleQuestionMark className="text-muted-foreground size-3" />
                  </Hint>
                </div>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="Ex: 30"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Volume base de treinamento por semana. <br />
                  {`Recomendação: ${volumeRecomendation}`}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Start Date */}
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Início</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Quando você pretende iniciar o plano de treinamento
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="bg-muted rounded-md p-4">
            <span className="text-muted-foreground text-sm">
              O plano de treinamento será criado com base no seu{" "}
              <Link
                to="/testes"
                className="hover:text-primary inline-block hover:underline"
              >
                <b>último teste adicionado</b>
              </Link>
            </span>
          </div>
        </div>
        <DialogFooter className="border-border bg-secondary/25 dark:bg-secondary/50 justify-end border-t px-6 pb-4 pt-4">
          <Button type="submit" className="min-w-60 overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                initial={{ opacity: 0, y: -25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 25 }}
                key={buttonState}
              >
                {buttonCopy[buttonState]}
              </motion.span>
            </AnimatePresence>
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
