import { PropsWithChildren, ReactNode, WheelEventHandler } from "react";

import * as SheetPrimitive from "@radix-ui/react-dialog";
import { Drawer } from "vaul";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export type ResponsiveSheetProps = PropsWithChildren<{
  content: ReactNode | string;
  side?: "bottom" | "top" | "left" | "right";
  openSheet?: boolean;
  setOpenSheet: (open: boolean) => void;
  mobileOnly?: boolean;
  sheetContentClassName?: string;
  onOpenAutoFocus?: SheetPrimitive.DialogContentProps["onOpenAutoFocus"];
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onWheel?: WheelEventHandler;
}>;

export function ResponsiveSheet({
  children,
  content,
  side = "right",
  openSheet,
  setOpenSheet,
  mobileOnly,
  sheetContentClassName,
  onOpenAutoFocus,
  onEscapeKeyDown,
  onWheel,
}: ResponsiveSheetProps) {
  const isMobile = useIsMobile();

  if (isMobile || mobileOnly) {
    return (
      <Drawer.Root open={openSheet} onOpenChange={setOpenSheet}>
        <Drawer.Trigger className="sm:hidden" asChild>
          {children}
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur" />
          <Drawer.Content
            className="bg-background fixed bottom-0 left-0 right-0 z-50 mt-16 rounded-t-lg border-t"
            onEscapeKeyDown={onEscapeKeyDown}
            onPointerDownOutside={(e) => {
              // Prevent dismissal when clicking inside a toast
              if (
                e.target instanceof Element &&
                e.target.closest("[data-sonner-toast]")
              ) {
                e.preventDefault();
              }
            }}
          >
            <div className="bg-muted mx-auto my-4 h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
            <div className="bg-background max-h-[80vh] min-h-[150px] w-full items-center justify-center overflow-auto pb-8 align-middle">
              {content}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side={side}
        onWheel={onWheel}
        onOpenAutoFocus={onOpenAutoFocus}
        onEscapeKeyDown={onEscapeKeyDown}
        className={cn(sheetContentClassName)}
      >
        {content}
      </SheetContent>
    </Sheet>
  );
}
