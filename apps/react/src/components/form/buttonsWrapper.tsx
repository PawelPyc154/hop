import { ReactNode } from "react";
import tw from "tailwind-styled-components";

interface ButtonsWrapperProps {
  children: ReactNode;
  className?: string;
}
export const ButtonsWrapper = ({
  children,
  className,
}: ButtonsWrapperProps) => (
  <Container className={className}>{children}</Container>
);

const Container = tw.div`flex gap-2`;
