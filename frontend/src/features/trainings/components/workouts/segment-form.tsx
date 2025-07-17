import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { segmentKinds } from "@/shared/constants/training.constants";
import { WorkoutFormData } from "@/shared/schemas";
import { getSegmentKindLabel } from "@/lib/calculations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
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
import { Textarea } from "@/components/ui/textarea";

interface SegmentFormProps {
  nestIndex?: number; // For blocks
  blockIndex?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function SegmentForm({ blockIndex, nestIndex }: SegmentFormProps) {
  const { control } = useFormContext<WorkoutFormData>();

  const fieldPath =
    nestIndex !== undefined
      ? (`blocks.${nestIndex}.segments` as const)
      : ("segments" as const);

  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldPath,
  });

  const addSegment = () => {
    append({
      orderInBlock: fields.length + 1,
      segmentKind: "WORK" as const,
      plannedDistanceM: undefined,
      duration: "00:00:00",
      targetPaceTime: "00:00",
      targetHr: undefined,
      restDistanceM: undefined,
      restDuration: "00:00",
      actualDistanceM: undefined,
      actualDurationS: undefined,
      avgPaceSPerKm: undefined,
      avgHr: undefined,
      notes: undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Segmentos</h4>
        <Button type="button" variant="outline" size="sm" onClick={addSegment}>
          <Plus className="mr-2 size-4" />
          Adicionar segmento
        </Button>
      </div>
      {fields.map((field, index) => (
        <Card key={field.id} className="relative shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">
                Segmento {index + 1}
                <FormField
                  control={control}
                  name={`${fieldPath}.${index}.segmentKind`}
                  render={({ field }) => (
                    <Badge variant="secondary" className="ml-2">
                      {getSegmentKindLabel(field.value)}
                    </Badge>
                  )}
                />
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`${fieldPath}.${index}.segmentKind`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de segmento</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select segment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {segmentKinds.map((option) => (
                          <SelectItem key={option} value={option}>
                            {getSegmentKindLabel(option)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`${fieldPath}.${index}.orderInBlock`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ordem</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseInt(e.target.value) || 1)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Planning section */}
            <div className="space-y-3">
              <h5 className="text-muted-foreground text-sm font-medium">
                Planejamento
              </h5>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name={`${fieldPath}.${index}.plannedDistanceM`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distância (m)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1000"
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
                  control={control}
                  name={`${fieldPath}.${index}.duration`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração</FormLabel>
                      <FormControl>
                        <Input
                          step="1"
                          placeholder="00:00"
                          className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                          type="time"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`${fieldPath}.${index}.targetPaceTime`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pace alvo (min/km)</FormLabel>
                      <FormControl>
                        <Input
                          step="60"
                          placeholder="00:00"
                          className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                          type="time"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`${fieldPath}.${index}.targetHr`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>BPM Alvo (batimentos/min)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="150"
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
                  control={control}
                  name={`${fieldPath}.${index}.notes`}
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Notas sobre esse segmento</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ex.: Descanso parado, caminhada, etc."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {fields.length === 0 && (
        <div className="text-muted-foreground py-8 text-center">
          <p>Nenhum segmento adicionado ainda.</p>
          <Button
            type="button"
            onClick={addSegment}
            variant="outline"
            className="mt-2 bg-transparent"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicione o primeiro segmento
          </Button>
        </div>
      )}
    </div>
  );
}
