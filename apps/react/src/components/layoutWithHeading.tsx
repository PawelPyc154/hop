import { ReactNode } from "react";
import tw from "tailwind-styled-components";
import { Heading } from "./common/heading";

interface LayoutWithHeadingProps {
  title: string;
  children: ReactNode;
}

export const LayoutWithHeading = ({
  title,
  children,
}: LayoutWithHeadingProps) => (
  <Container>
    <Wrapper>
      <Heading tag="h1" size="xl" className="text-center">
        {title}
      </Heading>
      {children}
    </Wrapper>
  </Container>
);

const Container = tw.div`px-4 pt-4 md:pt-10 pb-6`;
const Wrapper = tw.div`max-w-md mx-auto grid gap-4`;
export const ChildrenWrapper = tw.div`bg-white rounded-lg shadow-lg shadow-gray-200 divide-y`;
