import type { VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "motion/react";
import { type JSX, useEffect, useState } from "react";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button, type buttonVariants } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const useConfirm = ({
  title,
  message,
  variant,
  buttonCopy,
}: {
  title: string;
  message: string;
  variant: VariantProps<typeof buttonVariants>["variant"];
  buttonCopy: {
    idle: string;
    loading: JSX.Element;
  };
}): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);
  const [buttonState, setButtonState] = useState<"idle" | "loading">("idle");

  useEffect(() => {
    if (promise !== null) {
      setButtonState("idle");
    }
  }, [promise]);

  const confirm = () => {
    return new Promise((resolve) => {
      setPromise({ resolve });
    });
  };

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    setButtonState("loading");
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = () => (
    <ResponsiveDialog
      openDialog={promise !== null}
      setOpenDialog={handleClose}
      onEscapeKeyDown={handleCancel}
      dialogContentClassName='p-0 gap-0'
      content={
        <>
          <DialogHeader className='p-6'>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{message}</DialogDescription>
          </DialogHeader>
          <DialogFooter className='border-border bg-muted/25 dark:bg-muted/50 justify-end border-t px-6 pb-4 pt-4'>
            <Button
              className='min-w-60 overflow-hidden'
              variant={variant}
              onClick={handleConfirm}
            >
              <AnimatePresence mode='popLayout' initial={false}>
                <motion.span
                  transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                  initial={{ opacity: 0, y: -25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 25 }}
                  key={buttonState}
                >
                  {buttonCopy[buttonState]}
                </motion.span>
              </AnimatePresence>
            </Button>
          </DialogFooter>
        </>
      }
    />
  );

  return [ConfirmationDialog, confirm];
};
