import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";

import { trainingGoals } from "@/shared/constants/training.constants";
import { TestFormData, TestFormSchema } from "@/shared/schemas";
import { cn } from "@/lib/utils";
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
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";

import { useAddTest } from "../api/use-add-test";

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

const RACE_OPTIONS = ["race5K", "race10K", "race21K", "race42K"];

export const TestsTabContent = () => {
  const form = useForm<TestFormData>({
    resolver: zodResolver(TestFormSchema),
  });

  const goal = form.watch("goal");

  const { mutate: addTest, isPending: isAddingTest } = useAddTest();

  const handleSubmit = (data: TestFormData) => {
    addTest({
      form: {
        distanceM: data.distanceM.toString(),
        time: data.time,
        testType: data.testType,
        goal: data.goal,
        testDate: data.testDate.toISOString(),
        weeklyFrequency: data.weeklyFrequency.toString(),
        raceDate: data.raceDate?.toString(),
      },
    });
  };

  return (
    <TabsContent value="tests" className="px-4 py-8 md:px-8">
      <h4 className="text-lg md:text-xl">Meus Testes</h4>
      <p className="text-muted-foreground mt-2 text-base">
        Adicione testes de corrida já feitos para que sejam criadas suas zonas
        de treinamento.
      </p>
      <Separator className="my-6" />
      <Form {...form}>
        <form
          className="mt-8 max-w-lg space-y-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                      <SelectTrigger className="w-full flex-1">
                        <SelectValue placeholder="Teste" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1600m">1600m</SelectItem>
                      <SelectItem value="2400m">2400m</SelectItem>
                      <SelectItem value="3000m">3000m</SelectItem>
                      <SelectItem value="3200m">3200m</SelectItem>
                      <SelectItem value="5000m">5000m</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="testDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Dia do teste</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", {
                              locale: ptBR,
                            })
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
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        captionLayout="dropdown"
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
          {RACE_OPTIONS.includes(goal) && (
            <FormField
              control={form.control}
              name="raceDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Dia da corrida</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "animate-in fade-in-80 w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", {
                              locale: ptBR,
                            })
                          ) : (
                            <span>Selecione a data da corrida</span>
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
                        disabled={(date) => date < new Date()}
                        captionLayout="dropdown"
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Button type="submit">
            {isAddingTest ? "Salvando teste" : "Salvar"}
          </Button>
        </form>
      </Form>
    </TabsContent>
  );
};
