import clsx from "clsx";
import React, { forwardRef, ReactNode } from "react";
import { MdCheckBox, MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { FieldWrapper } from "../fieldWrapper/fieldWrapper";
import tw from "tailwind-styled-components";

const colors = {
  green: `text-emerald-600 hover:text-emerald-700`,
  black: `text-gray-800 hover:text-black-700`,
};

export interface CheckboxProps {
  text?: ReactNode;
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  isRequired?: boolean;
  isRequiredText?: boolean;
  color?: keyof typeof colors;
  className?: string;
  classNameLabel?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      onChange,
      text,
      color = "black",
      isRequired,
      className,
      error,
      label,
      isRequiredText,
      disabled,
    },
    ref
  ) => (
    <FieldWrapper
      className={clsx(disabled && "opacity-50 pointer-events-none", className)}
      error={error}
      isRequired={isRequired}
      label={label}
    >
      <Label>
        <Input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={onChange}
        />
        <IconWrapper className={error ? `text-red-600` : colors[color]}>
          {!checked ? <MdOutlineCheckBoxOutlineBlank /> : <MdCheckBox />}
        </IconWrapper>
        <TextWrapper>
          {text} {isRequiredText && <StarWrapper>*</StarWrapper>}
        </TextWrapper>
      </Label>
    </FieldWrapper>
  )
);

Checkbox.displayName = "Checkbox";

const Label = tw.label`relative select-none cursor-pointer flex gap-1`;
const IconWrapper = tw.div`text-[22px] 2xl:text-2xl`;
const Input = tw.input`absolute inset-0 invisible`;
const TextWrapper = tw.div`flex gap-0.5 items-center`;
const StarWrapper = tw.div`text-red-600`;
