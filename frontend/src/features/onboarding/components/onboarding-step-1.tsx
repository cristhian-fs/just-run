import {
  onboardingStep1,
} from "@/shared/schemas";

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

import { useFormContext } from "react-hook-form";

import { z } from "zod";
import { NextButton } from "./next-button";
import { useMultiStepForm } from "./stepped-form";

import { motion } from "motion/react";

export function OnboardingStep1(){
  const {
    control,
  } = useFormContext<z.infer<typeof onboardingStep1>>();

  const { nextStep } = useMultiStepForm();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-4 flex flex-col min-h-screen justify-end p-6 py-24 md:min-h-0 md:py-0 md:justify-start"
    >
      <div className="max-w-lg mx-auto mb-8 flex flex-col md:items-center md:text-center">
        <h1 className="text-3xl font-semibold">Informações pessoais</h1>
        <p className="text-muted-foreground">Preencha seus dados pessoais</p>
      </div>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome Completo</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Seu email</FormLabel>
            <FormControl>
              <Input {...field} disabled />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Seu gênero</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione seu gênero" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="male">Homem</SelectItem>
                <SelectItem value="female">Mulher</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <FormField
          control={control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sua idade</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  className="appearance-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="weightKg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seu peso (kg)</FormLabel>
              <FormControl>
                <Input placeholder="70kg" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="heightCm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sua altura (cm)</FormLabel>
              <FormControl>
                <Input placeholder="175cm" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
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
                <SelectItem value="intermediate">Intermediário</SelectItem>
                <SelectItem value="advanced">Avançado</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <NextButton 
        onClick={() => nextStep()}
      />
    </motion.div>
  )
}