import { ReactNode } from "react";
import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";
import { ButtonSelect } from "./buttonSelect";
import { ButtonProps, ButtonPropsBasic } from "../button";

export type SelectControlOptions<Value extends string = string> = {
  text: string;
  value: Value;
  colorVariants: ButtonProps["color"];
  colorVariantsActive: ButtonProps["color"];
  icon?: ReactNode;
}[];

type InputControlProps = {
  className?: string;
  options: SelectControlOptions<string>;
  label?: ReactNode;
  isRequired?: boolean;
} & Pick<ButtonPropsBasic, "size">;

export const ButtonSelectControl = <
  TFieldValues extends FieldValues = FieldValues,
>({
  control,
  name,
  rules,
  defaultValue,
  label,
  className,
  shouldUnregister,
  ...restProps
}: InputControlProps & UseControllerProps<TFieldValues>) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
    defaultValue,
    shouldUnregister,
  });
  return (
    <ButtonSelect
      className={className}
      label={label}
      error={error?.message}
      {...field}
      {...restProps}
      onChange={(v) =>
        field.onChange(field.value === v.target.value ? null : v.target.value)
      }
    />
  );
};
