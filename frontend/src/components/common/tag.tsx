import { createElement, ReactNode } from "react";

interface TagProps {
  tag: "div" | "h1" | "h2" | "h3" | "h4" | "h5";
  children: ReactNode;
  className: string;
}
export const Tag = ({ tag, children, ...props }: TagProps) =>
  createElement<any, HTMLElement>(tag || "div", { ...props }, children);
