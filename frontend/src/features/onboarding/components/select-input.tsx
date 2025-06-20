import React from "react";

import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { SelectInputProps } from "../types";

export const SelectInput = ({
  name,
  label,
  placeholder,
  options,
  control,
  colSpan,
}: SelectInputProps) => {
  return (
    <FormField
      name={name}
      control={control}
      key={name}
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
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value as string}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};
