import { JSX, useEffect, useState } from "react";

import { AnimatePresence, motion } from "motion/react";

import { Button } from "./ui/button";

interface AnimatedStateButtonProps {
  buttonCopy: {
    idle: string;
    loading: JSX.Element;
    success: string;
  };
  isLoading: boolean;
  isSuccess: boolean;
  type?: HTMLButtonElement["type"];
}

export function AnimatedStateButton({
  buttonCopy,
  isLoading,
  isSuccess,
  type = "button",
}: AnimatedStateButtonProps) {
  const [buttonState, setButtonState] = useState<
    "idle" | "loading" | "success"
  >("idle");

  useEffect(() => {
    if (isLoading) {
      setButtonState("loading");
    } else if (isSuccess) {
      setButtonState("success");

      const timeout = setTimeout(() => {
        setButtonState("idle");
      }, 3000);
      return () => clearTimeout(timeout);
    } else {
      setButtonState("idle");
    }
  }, [isLoading, isSuccess]);

  return (
    <Button type={type} className="min-w-60 overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
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
  );
}
