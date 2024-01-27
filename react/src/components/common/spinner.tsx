import clsx from "clsx";
import tw from "tailwind-styled-components";

const colors = {
  teal: `text-teal-700`,
  white: `text-white`,
};
const sizes = {
  sm: `h-5 w-5`,
  base: `h-9 w-9`,
};
const variants = {
  absoluteCenter: `absolute inset-0 flex justify-center items-center`,
  static: ``,
};
const overlays = {
  none: ``,
  white: `bg-white bg-opacity-60`,
};

interface SpinnerProps {
  size?: keyof typeof sizes;
  variant?: keyof typeof variants;
  color?: keyof typeof colors;
  overlay?: keyof typeof overlays;
}

export const Spinner = ({
  size = "base",
  variant = "absoluteCenter",
  color = "white",
  overlay = "none",
}: SpinnerProps) => (
  <Container className={clsx(variants[variant], overlays[overlay])}>
    <SVG
      className={clsx(sizes[size], colors[color])}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </SVG>
  </Container>
);

const Container = tw.div`z-40`;
const SVG = tw.svg`animate-spin`;
