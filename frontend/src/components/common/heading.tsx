import clsx from "clsx";
import { ReactNode } from "react";
import { Tag } from "./tag";

const sizes = {
  sm: `text-xs 2xl:text-sm font-medium`,
  base: `text-sm 2xl:text-base font-medium`,
  lg: `text-base 2xl:text-lg font-normal`,
  xl: `text-lg 2xl:text-xl font-normal`,
  "2xl": `text-xl 2xl:text-2xl font-normal`,
  "3xl": `text-2xl 2xl:text-3xl font-normal`,
  "4xl": `text-3xl 2xl:text-4xl font-normal`,
};
export interface HeadingProps {
  tag: "h1" | "h2" | "h3" | "h4" | "h5";
  children: ReactNode;
  className?: string;
  size: keyof typeof sizes;
}

export const Heading = ({
  tag,
  children,
  className,
  size,
  ...props
}: HeadingProps) => (
  <Tag tag={tag} className={clsx(sizes[size], className)} {...props}>
    {children}
  </Tag>
);
