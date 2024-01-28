/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-vars */

import { cloneElement, forwardRef, ReactNode, useEffect, useRef } from "react";
import { DialogProvider } from "./dialogProvider";
import { DialogBase, DialogBaseSizes } from "./dialogBase";
import { callAll } from "../../../utils/callAll";
interface DialogProps {
  // eslint-disable-next-line no-undef
  trigger: JSX.Element;
  children: (options: { onCloseDialog: () => void }) => ReactNode;
  title: string;
  size?: DialogBaseSizes;
}

export const DialogTrigger = forwardRef<HTMLElement, DialogProps>(
  ({ trigger, title, size, children }, ref) => (
    <DialogProvider>
      {({ isOpenDialog, setIsOpenDialog }) => (
        <>
          {cloneElement(trigger, {
            ref: ref,
            onClick: callAll(
              () => setIsOpenDialog(true),
              trigger.props.onClick
            ),
          })}

          {isOpenDialog && (
            <DialogBase
              title={title}
              size={size}
              onCloseDialog={() => setIsOpenDialog(false)}
            >
              {children({ onCloseDialog: () => setIsOpenDialog(false) })}
            </DialogBase>
          )}
        </>
      )}
    </DialogProvider>
  )
);
DialogTrigger.displayName = "";
