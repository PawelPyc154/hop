"use client";

import { ReactNode } from "react";
import { Label } from "../label/label";
import { FieldError } from "../fieldError/fieldError";
import tw from "tailwind-styled-components";

export type FieldWrapperProps = {
  label?: ReactNode;
  className?: string;
  error?: string;
  isRequired?: boolean;
  children: ReactNode;
};
export const FieldWrapper = ({
  label,
  className,
  error,
  isRequired,
  children,
}: FieldWrapperProps) => {
  return (
    <Container className={className}>
      {label && <Label isRequired={isRequired}>{label}</Label>}
      {children}
      {error && <FieldError error={error} />}
    </Container>
  );
};

const Container = tw.div`text-sm w-full grid gap-1 content-start`;
