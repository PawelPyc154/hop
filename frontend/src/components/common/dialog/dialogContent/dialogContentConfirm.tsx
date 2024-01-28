import { MouseEventHandler } from "react";
import { useDialogContext } from "../dialogProvider";
import { ButtonsWrapper } from "../../../form/buttonsWrapper";
import { Button } from "../../../form/button";

interface DialogContentConfirmProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  isLoading: boolean;
}

const DialogContentConfirm = ({
  onClick,
  isLoading,
}: DialogContentConfirmProps) => {
  const { setIsOpenDialog } = useDialogContext();
  return (
    <ButtonsWrapper className="justify-center">
      <Button onClick={() => setIsOpenDialog(false)} color="gray">
        Cancel
      </Button>
      <Button onClick={onClick} isLoading={isLoading}>
        Confirm
      </Button>
    </ButtonsWrapper>
  );
};

export { DialogContentConfirm };
