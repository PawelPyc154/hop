import { forwardRef, ReactNode } from "react";
import clsx from "clsx";
import { FieldWrapper } from "../fieldWrapper/fieldWrapper";
import tw from "tailwind-styled-components";

const colors = { white: `bg-white `, gray: `bg-gray-200` };

export type InputProps = Pick<
  JSX.IntrinsicElements["input"],
  "type" | "onChange" | "onBlur" | "value" | "name" | "placeholder" | "disabled"
> & {
  label?: string;
  icon?: ReactNode;
  error?: string;
  className?: string;
  isRequired?: boolean;
  color?: keyof typeof colors;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      className,
      icon,
      color = "white",
      error,
      isRequired,
      disabled,
      ...props
    },
    ref
  ) => (
    <FieldWrapper
      className={clsx(disabled && "opacity-50", className)}
      error={error}
      isRequired={isRequired}
      label={label}
    >
      <Wrapper>
        <InputStyled
          className={clsx([colors[color], !!icon && `pl-10 `])}
          disabled={disabled}
          {...props}
          ref={ref}
        />
        <IconWrapper>{icon}</IconWrapper>
      </Wrapper>
    </FieldWrapper>
  )
);

Input.displayName = "Input";

const Wrapper = tw.div`relative`;
const InputStyled = tw.input`bg-white rounded-lg px-3 h-11 flex border border-gray-300 items-center w-full pb-px`;
const IconWrapper = tw.div`absolute text-xl h-10 px-3 flex justify-center items-center top-1/2 left-0 -translate-y-1/2`;
