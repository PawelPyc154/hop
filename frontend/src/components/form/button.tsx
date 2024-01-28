/* eslint-disable react/button-has-type */
import clsx from "clsx";
import React, { forwardRef, ReactNode } from "react";
import tw from "tailwind-styled-components";
import { Spinner } from "../common/spinner";
import { Link, LinkProps, NavLink } from "react-router-dom";

const colors = {
  none: ``,
  white: `text-black bg-white hover:bg-gray-100`,
  gray: `text-black bg-gray-100 hover:bg-gray-200`,
  darkGray: `text-white bg-gray-800 hover:bg-gray-900`,
  emerald: `text-white bg-emerald-500 hover:bg-emerald-600`,
  red: `text-white bg-red-600 hover:bg-red-700`,
  black: `text-white bg-black hover:opacity-90`,
  blackOutline: `border-2 border-black text-black hover:bg-black hover:text-white`,
};

const loadingColors: typeof colors = {
  none: ``,
  white: `text-white`,
  gray: `text-gray-100`,
  darkGray: `text-gray-200`,
  emerald: `text-emerald-600`,
  red: `text-red-600`,
  black: `text-black`,
  blackOutline: `bg-black text-white`,
};

const sizes = {
  lg: `h-11`,
  base: `h-10`,
  md: `h-9`,
};

const iconWrapperSizes: Record<keyof typeof sizes, string> = {
  lg: `h-11 w-11`,
  base: `h-10 w-10`,
  md: `h-9 w-9`,
};

export type ButtonPropsBasic = {
  color?: keyof typeof colors;
  size?: keyof typeof sizes;
  icon?: ReactNode;
  iconWrapperClassName?: string;
};

export type ButtonProps = Pick<
  JSX.IntrinsicElements["button"],
  "onClick" | "className" | "children" | "type" | "disabled"
> &
  ButtonPropsBasic & { isLoading?: boolean };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      type = "button",
      color = "emerald",
      isLoading,
      size = "base",
      icon,
      iconWrapperClassName,

      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      className={getContainerStyles({
        className,
        color,
        size,
        isLoading,
        hasIcon: !!icon,
        hasChildren: !!children,
      })}
      type={type}
      {...props}
    >
      {icon ? (
        <IconWrapper
          className={clsx(iconWrapperClassName, iconWrapperSizes[size])}
        >
          {icon}
        </IconWrapper>
      ) : null}
      {children}
      {isLoading && <Spinner size="sm" />}
    </button>
  )
);

Button.displayName = "Button";

type ButtonRadioProps = ButtonPropsBasic & {
  value: string;
  className?: string;
  children?: string;
  name: string;
  checked: boolean;
  colorVariants?: keyof typeof colors;
  colorVariantsActive?: keyof typeof colors;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

export const ButtonRadio = forwardRef<HTMLInputElement, ButtonRadioProps>(
  (
    {
      value,
      icon,
      iconWrapperClassName,
      size = "base",
      className,
      children,
      name,
      checked,
      colorVariants = "emerald",
      colorVariantsActive = "gray",
      onChange,
    },
    ref
  ) => (
    <div
      className={getContainerStyles({
        className: className,
        color: checked ? colorVariantsActive : colorVariants,
        size,
        hasIcon: !!icon,
        hasChildren: !!children,
      })}
    >
      <label className="absolute inset-0">
        <input
          ref={ref}
          onChange={onChange}
          type="checkbox"
          name={name}
          className="absolute inset-0"
          value={value}
          checked={checked}
          style={{ appearance: "none", WebkitAppearance: "none" }}
        />
      </label>

      {icon ? (
        <IconWrapper
          className={clsx(iconWrapperClassName, iconWrapperSizes[size])}
        >
          {icon}
        </IconWrapper>
      ) : null}
      {children}
    </div>
  )
);
ButtonRadio.displayName = "ButtonRadio";

type LinkButtonProps = LinkProps &
  ButtonPropsBasic & { children?: ReactNode; className?: string };

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  (
    {
      children,
      className,
      color = "emerald",
      size = "base",
      icon,
      iconWrapperClassName,
      ...props
    },
    ref
  ) => (
    <NavLink
      ref={ref}
      className={({ isActive }) =>
        getContainerStyles({
          className,
          color: isActive ? "darkGray" : color,
          size,
          hasIcon: !!icon,
          hasChildren: !!children,
        })
      }
      {...props}
    >
      {icon ? (
        <IconWrapper
          className={clsx(iconWrapperClassName, iconWrapperSizes[size])}
        >
          {icon}
        </IconWrapper>
      ) : null}
      {children}
    </NavLink>
  )
);
LinkButton.displayName = "LinkButton";

type LinkNativeButtonProps = JSX.IntrinsicElements["a"] &
  ButtonPropsBasic & { children?: ReactNode; className?: string };

export const LinkNativeButton = forwardRef<
  HTMLAnchorElement,
  LinkNativeButtonProps
>(
  (
    {
      children,
      className,
      color = "emerald",
      size = "base",
      icon,
      iconWrapperClassName,
      ...props
    },
    ref
  ) => (
    <a
      ref={ref}
      className={getContainerStyles({
        className,
        color,
        size,
        hasIcon: !!icon,
        hasChildren: !!children,
      })}
      {...props}
    >
      {icon ? (
        <IconWrapper
          className={clsx(iconWrapperClassName, iconWrapperSizes[size])}
        >
          {icon}
        </IconWrapper>
      ) : null}
      {children}
    </a>
  )
);
LinkNativeButton.displayName = "LinkButton";

const IconWrapper = tw.span`flex items-center justify-center`;

const getContainerStyles = ({
  color = "emerald",
  isLoading,
  size = "base",
  hasIcon,
  hasChildren,
  className,
}: {
  color?: keyof typeof colors;
  hasIcon: boolean;
  hasChildren: boolean;
  size?: keyof typeof sizes;
  isLoading?: boolean;
  className?: string;
}) =>
  clsx(
    "disabled:opacity-30 disabled:pointer-events-none flex font-medium rounded-md justify-center items-center relative select-none",
    hasIcon
      ? hasChildren
        ? clsx("pr-4", sizes[size])
        : iconWrapperSizes[size]
      : "px-4",
    colors[color],
    isLoading && ["pointer-events-none", loadingColors[color]],
    sizes[size],
    className
  );
