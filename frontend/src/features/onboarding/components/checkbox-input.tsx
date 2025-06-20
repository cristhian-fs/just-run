import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { CheckboxInputProps } from "../types";

export const CheckboxInput = ({
  name,
  label,
  options,
  control,
  colSpan,
}: CheckboxInputProps) => (
  <FormField
    key={name}
    control={control}
    name={name}
    render={() => (
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
        <div className="mb-4">
          <FormLabel>{label}</FormLabel>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {options.map((option) => (
            <FormField
              key={option.value}
              name={name}
              control={control}
              render={({ field }) => {
                const currentValue = Array.isArray(field.value)
                  ? field.value
                  : [];
                return (
                  <FormItem className="flex flex-row items-start space-x-1 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={currentValue.includes(option.value)}
                        onCheckedChange={(checked) => {
                          const newValue = checked
                            ? [...currentValue, option.value]
                            : currentValue.filter(
                                (value) => value !== option.value,
                              );
                          field.onChange(newValue);
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-base font-normal">
                      {option.label}
                    </FormLabel>
                  </FormItem>
                );
              }}
            />
          ))}
        </div>
      </FormItem>
    )}
  />
);
