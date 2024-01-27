import { forwardRef, ReactNode } from "react";

import { FieldWrapper } from "../fieldWrapper/fieldWrapper";
import tw from "tailwind-styled-components";

export interface ButtonSelectProps {
  className?: string;
  classNameOptionsWrapper?: string;
  options?: {
    slot: ReactNode;
    value: string;
  }[];
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  label: ReactNode;
  name: string;
  error?: string;
  isRequired?: boolean;
}

export const ButtonSelectBorder = forwardRef<
  HTMLInputElement,
  ButtonSelectProps
>(
  (
    {
      className,
      options = [],
      onChange,
      value,
      label,
      error,
      isRequired,
      name,
      classNameOptionsWrapper,
    }: ButtonSelectProps,
    ref
  ) => (
    <FieldWrapper
      className={className}
      error={error}
      isRequired={isRequired}
      label={label}
    >
      <Wrapper className={classNameOptionsWrapper}>
        {options.map((option) => (
          <Option
            key={option.value}
            className={value === option.value ? "ring-blue-500 ring-2" : ""}
          >
            {option.slot}
            <Input
              ref={ref}
              onChange={onChange}
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              style={{ appearance: "none", WebkitAppearance: "none" }}
            />
          </Option>
        ))}
      </Wrapper>
    </FieldWrapper>
  )
);

ButtonSelectBorder.displayName = "ButtonSelect";

const Wrapper = tw.fieldset`flex gap-4 flex-wrap`;
const Option = tw.div`relative cursor-pointer rounded-xl overflow-hidden`;
const Input = tw.input`absolute inset-0`;
