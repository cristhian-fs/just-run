import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { trainingGoals } from "@/shared/constants/training.constants";
import { onboardingSchema } from "@/shared/schemas/onboarding.schemas";
import { TOnboarding } from "@/shared/types";
import { userQueryOptions } from "@/lib/api";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const steps = [
  {
    title: "Dados pessoais",
    inputs: [
      {
        name: "name",
        optional: false,
      },
      {
        name: "email",
        type: "email",
        label: "Email",
        optional: false,
      },
      {
        name: "gender",
        optional: false,
      },
      {
        name: "weightKg",
        optional: false,
      },
      {
        name: "heightCm",
        optional: false,
      },
    ],
  },
  {
    title: "Teste",
    inputs: [
      {
        name: "testType",
        optional: false,
      },
      {
        name: "distanceM",
        optional: false,
      },
      {
        name: "time",
        optional: false,
      },
    ],
  },
  {
    title: "Objetivos",
    inputs: [
      { name: "objetive", optional: false },
      { name: "goal", optional: false },
    ],
  },
];

const GOAL_MAPPING = {
  startRunning: "Começar na corrida",
  improveHealth: "Melhorar a saude",
  loseWeight: "Perder peso",
  runFaster: "Correr mais rápido",
  runLonger: "Correr distâncias maiores",
  race5K: "Corrida de 5K",
  race10K: "Corrida de 10K",
  race21K: "Meia maratona (21K)",
  race42K: "Maratona (42K)",
};

export const OnboardingForm = () => {
  const { data } = useQuery(userQueryOptions());

  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<TOnboarding>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: data?.name ?? "",
      email: data?.email ?? "",
      gender: (data?.gender as TOnboarding["gender"]) ?? "male",
    },
  });

  const goToStep = async (nextStep: number) => {
    const currentInputs = steps[currentStep]?.inputs;
    if (!currentInputs) return;

    // Limpa todos os erros antes de validar
    form.clearErrors();

    // Campos obrigatórios da etapa atual
    const requiredFieldNames = currentInputs
      .filter((input) => !input.optional)
      .map((input) => input.name);

    // Validação manual campo por campo
    let hasErrors = false;

    for (const fieldName of requiredFieldNames) {
      const value = form.getValues(fieldName as keyof TOnboarding);

      // Verifica se o campo está vazio
      if (!value || value === "" || value === null || value === undefined) {
        form.setError(fieldName as keyof TOnboarding, {
          type: "manual",
          message: "Este campo é obrigatório",
        });
        hasErrors = true;
      }
    }

    // Se houver erros, não avança
    if (hasErrors) {
      return;
    }

    // Validação adicional com schema (opcional, para validações mais complexas)
    try {
      const fieldsForPick = Object.fromEntries(
        requiredFieldNames.map((fieldName) => [fieldName, true]),
      ) as Record<keyof TOnboarding, true>;

      const stepSchema = onboardingSchema.pick(fieldsForPick);
      const currentValues = form.getValues();

      const result = stepSchema.safeParse(currentValues);

      if (!result.success) {
        result.error.errors.forEach((err) => {
          if (err.path[0]) {
            form.setError(err.path[0] as keyof TOnboarding, {
              type: "manual",
              message: err.message,
            });
          }
        });
        return;
      }
    } catch (error) {
      console.error("Erro na validação do schema:", error);
      return;
    }

    // ✅ só muda se válido
    setCurrentStep(nextStep);
  };

  const handleSubmit = (values: TOnboarding) => {
    const [hours, minutes, seconds] = values.time.split(":").map(Number);
    const timeInSeconds = hours * 3600 + minutes * 60 + seconds;
    const finalPayload = {
      ...values,
      time: timeInSeconds,
    };
    console.log({ finalPayload });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {currentStep === 0 && (
          <div className="w-full space-y-4">
            <p className="mb-4 md:text-xl">Informações pessoais</p>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu email" disabled {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gênero</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seu gênero" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Homem</SelectItem>
                        <SelectItem value="female">Mulher</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weightKg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seu peso (kg)</FormLabel>
                    <FormControl>
                      <Input placeholder="70kg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="heightCm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sua altura (cm)</FormLabel>
                    <FormControl>
                      <Input placeholder="175cm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
        {currentStep === 1 && (
          <div className="w-full space-y-4">
            <div className="">
              <h4>Testes</h4>
              <span className="text-muted-foreground inline-block text-base">
                Usaremos os resultados do seu teste para formar seu plano de
                treinamento
              </span>
            </div>
            <FormField
              control={form.control}
              name="testType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de teste realizado</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Teste" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="3K">3km</SelectItem>
                      <SelectItem value="5K">5km</SelectItem>
                      <SelectItem value="6K">6km</SelectItem>
                      <SelectItem value="10K">10km</SelectItem>
                      <SelectItem value="21K">21km</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="distanceM"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distância percorrida (m)</FormLabel>
                  <FormControl>
                    <Input placeholder="3000m" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempo gasto (hh:mm:ss)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="00:00:00"
                      type="time"
                      step="1"
                      className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        {currentStep === 2 && (
          <div className="w-full space-y-4">
            <div className="">
              <h4>Seu nivel de atleta</h4>
              <span className="text-muted-foreground inline-block text-sm">
                Seu nível será usado como parâmetro para o plano de treinamento
              </span>
            </div>
            <FormField
              control={form.control}
              name="weeklyFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantos dias da semana treina?</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Dias da semana" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1 dia</SelectItem>
                      <SelectItem value="2">2 dias</SelectItem>
                      <SelectItem value="3">3 dias</SelectItem>
                      <SelectItem value="4">4 dias</SelectItem>
                      <SelectItem value="5">5 dias</SelectItem>
                      <SelectItem value="6">6 dias</SelectItem>
                      <SelectItem value="7">7 dias</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="trainingLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qual o seu nivel atual?</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Iniciante, Intermediário, Avançado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="beginner">Iniciante</SelectItem>
                      <SelectItem value="intermediate">
                        Intermediário
                      </SelectItem>
                      <SelectItem value="advanced">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qual o seu objetivo na corrida?</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Dias da semana" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {trainingGoals.map((goal) => (
                        <SelectItem key={goal} value={goal}>
                          {GOAL_MAPPING[goal]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        <div className="flex items-center justify-between gap-x-2">
          {currentStep > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Voltar
            </Button>
          )}
          {currentStep < steps.length - 1 && (
            <Button
              onClick={() => goToStep(currentStep + 1)}
              className="ml-auto"
              type="button"
            >
              Avançar
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button type="submit">Finalizar</Button>
          )}
        </div>
      </form>
    </Form>
  );
};
