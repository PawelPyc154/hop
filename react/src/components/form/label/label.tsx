import { ReactNode } from "react";
import tw from "tailwind-styled-components";

interface LabelProps {
  children: ReactNode;
  isRequired?: boolean;
  className?: string;
}
export const Label = ({ children, isRequired, className }: LabelProps) => (
  <Container htmlFor="todo" className={className}>
    {children} {isRequired && <RequiredStar>*</RequiredStar>}
  </Container>
);

const Container = tw.label`text-sm font-medium flex text-gray-800`;
const RequiredStar = tw.div`text-red-600`;
