import { DialogContent, DialogOverlay } from "@reach/dialog";
import "@reach/dialog/styles.css";
import clsx from "clsx";
import { ReactNode } from "react";
import { MdClose } from "react-icons/md";
import { Heading } from "../heading";
import tw from "tailwind-styled-components";

const sizes = {
  md: `xl:max-w-md`,
  lg: `xl:max-w-lg`,
  xl: `xl:max-w-xl`,
  "2xl": `xl:max-w-2xl`,
  "3xl": `xl:max-w-3xl`,
  "4xl": `xl:max-w-4xl`,
  "5xl": `xl:max-w-5xl`,
  "6xl": `xl:max-w-6xl`,
  "7xl": `xl:max-w-7xl`,
};
export type DialogBaseSizes = keyof typeof sizes;

interface DialogBaseProps {
  title: string;
  size?: DialogBaseSizes;
  onCloseDialog: () => void;
  // eslint-disable-next-line no-unused-vars
  children: ReactNode;
}
export const DialogBase = ({
  children,
  size = "2xl",
  title,
  onCloseDialog,
}: DialogBaseProps) => (
  <DialogOverlayStyled dangerouslyBypassScrollLock>
    <DialogContentStyled
      id="dialogContent"
      className={clsx(sizes[size])}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <HeadingStyled size="xl" tag="h1">
        {title}
        <CloseButton color="gray" type="button" onClick={onCloseDialog}>
          <MdClose size="26" />
        </CloseButton>
      </HeadingStyled>
      <div className="p-4 md:p-6 pt-1 md:pt-1">{children}</div>
    </DialogContentStyled>
  </DialogOverlayStyled>
);

const DialogOverlayStyled = tw(DialogOverlay)`z-50 p-4`;
const DialogContentStyled = tw(
  DialogContent
)`rounded-md !p-0 relative overflow-hidden !w-full mt-12 xl:mt-20`;
const HeadingStyled = tw(
  Heading
)`py-2 md:py-4 pl-4 pr-4 md:pl-6 md:pr-6 relative`;
const CloseButton = tw.button`p-2 absolute right-1 top-1/2 -translate-y-1/2`;
