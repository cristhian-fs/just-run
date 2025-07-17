import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { segmentKinds } from "@/shared/constants/training.constants";
import { WorkoutFormData } from "@/shared/schemas";
import { getSegmentKindLabel } from "@/lib/calculations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

import { SegmentForm } from "./segment-form";

export function BlockForm() {
  const { control } = useFormContext<WorkoutFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "blocks",
  });

  const addBlock = () => {
    append({
      blockKind: "COOLDOWN",
      orderIndex: fields.length,
      repeatCount: 1,
      description: "",
      segments: [],
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Blocos de treinamento</h3>
        <Button type="button" variant="outline" onClick={addBlock}>
          <Plus />
          Adicionar bloco
        </Button>
      </div>
      {fields.length > 0 && (
        <Accordion type="single" collapsible className="space-y-4">
          {fields.map((field, index) => (
            <AccordionItem key={field.id} value={`block-${index}`}>
              <Card className="relative py-0">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="mr-4 flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Block {index + 1}</span>
                      <FormField
                        control={control}
                        name={`blocks.${index}.blockKind`}
                        render={({ field }) => (
                          <Badge variant="secondary">
                            {getSegmentKindLabel(field.value)}
                          </Badge>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`blocks.${index}.repeatCount`}
                        render={({ field }) => (
                          <Badge variant="outline">{field.value}x</Badge>
                        )}
                      />
                    </div>
                  </div>
                </AccordionTrigger>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(index);
                  }}
                  className="text-destructive hover:text-destructive absolute right-[calc((var(--spacing)*6)+var(--spacing)*6)] top-3"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <AccordionContent>
                  <CardContent className="space-y-8">
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={control}
                        name={`blocks.${index}.blockKind`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Escolha o tipo de bloco</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select type" />
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
                        name={`blocks.${index}.repeatCount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número de repetições</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                max="50"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    Number.parseInt(e.target.value) || 1,
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
                        name={`blocks.${index}.orderIndex`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ordem</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    Number.parseInt(e.target.value) || 0,
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={control}
                      name={`blocks.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva esse bloco de treinamento..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <SegmentForm nestIndex={index} />
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {fields.length === 0 && (
        <div className="text-muted-foreground py-8 text-center">
          <p>Nenhum bloco de treinamento criado ainda.</p>
          <Button
            type="button"
            onClick={addBlock}
            variant="outline"
            className="mt-2 bg-transparent"
          >
            <Plus className="mr-2 h-4 w-4" />
            Crie o primeiro bloco
          </Button>
        </div>
      )}
    </div>
  );
}
