import { forwardRef, ReactNode } from "react";

import { FieldWrapper } from "../fieldWrapper/fieldWrapper";
import tw from "tailwind-styled-components";
import { ButtonProps, ButtonPropsBasic, ButtonRadio } from "../button";

export type ButtonSelectProps = {
  className?: string;
  options: {
    text: string;
    value: string;
    colorVariants: ButtonProps["color"];
    colorVariantsActive: ButtonProps["color"];
    icon?: ReactNode;
  }[];
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  label: ReactNode;
  name: string;
  error?: string;
  isRequired?: boolean;
} & Pick<ButtonPropsBasic, "size">;

export const ButtonSelect = forwardRef<HTMLInputElement, ButtonSelectProps>(
  (
    {
      className,
      options,
      onChange,
      value,
      label,
      error,
      isRequired,
      name,
      size = "lg",
    }: ButtonSelectProps,
    ref
  ) => (
    <FieldWrapper
      className={className}
      error={error}
      isRequired={isRequired}
      label={label}
    >
      <Wrapper>
        {options.map((option) => (
          <ButtonRadio
            size={size}
            ref={ref}
            checked={value === option.value}
            colorVariants={option.colorVariants}
            colorVariantsActive={option.colorVariantsActive}
            name={name}
            key={option.value}
            value={option.value}
            onChange={onChange}
            {...(option.icon && {
              className: "pr-0 md:pr-4",
              iconWrapperClassName: "absolute md:static top-0 left-2",
            })}
            icon={option.icon}
          >
            {option.text}
          </ButtonRadio>
        ))}
      </Wrapper>
    </FieldWrapper>
  )
);

ButtonSelect.displayName = "ButtonSelect";

const Wrapper = tw.fieldset`grid md:flex gap-2 flex-wrap md:justify-center`;
