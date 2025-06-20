import React from "react";

import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { TextInputProps } from "../types";

export const TextInput = ({
  name,
  label,
  placeholder,
  control,
  colSpan,
}: TextInputProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn("col-span-full", {
            "col-span-1": colSpan === 1,
            "col-span-2": colSpan === 2,
            "col-span-3": colSpan === 3,
            "col-span-4": colSpan === 4,
            "col-span-5": colSpan === 5,
            "col-span-6": colSpan === 6,
          })}
        >
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} placeholder={placeholder} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
