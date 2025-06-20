import { Control, FieldPath } from "react-hook-form";

import { TOnboarding } from "@/shared/types";

type BaseInput = {
  label: string;
  name: string;
  placeholder: string;
  optional: boolean;
  colSpan?: number;
};

type TextInput = BaseInput & {
  type: "text";
};

type SelectInput = BaseInput & {
  type: "select";
  options: {
    value: string;
    label: string;
  }[];
};

type CheckboxInput = BaseInput & {
  type: "checkbox";
  options: {
    value: string;
    label: string;
  }[];
};

type InputField = TextInput | SelectInput | CheckboxInput;

export type Step = {
  label: string;
  fields: InputField[];
};

export interface BaseInputProps<T extends FieldPath<TOnboarding>> {
  name: T;
  label: string;
  placeholder?: string;
  hint?: string;
  optional?: boolean;
  control: Control<TOnboarding>;
  colSpan?: number;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface TextInputProps extends BaseInputProps<FieldPath<TOnboarding>> {
  type: "text";
}

export interface SelectInputProps
  extends BaseInputProps<FieldPath<TOnboarding>> {
  type: "select";
  options: SelectOption[];
}

export interface CheckboxInputProps
  extends BaseInputProps<FieldPath<TOnboarding>> {
  type: "checkbox";
  options: SelectOption[];
}

export type InputConfig =
  | TextInputProps
  | SelectInputProps
  | CheckboxInputProps;
