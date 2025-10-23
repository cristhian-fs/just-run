import type * as DialogPrimitive from "@radix-ui/react-dialog";
import type { PropsWithChildren, ReactNode } from "react";
import { Drawer } from "vaul";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "../lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

export type DialogProps = PropsWithChildren<{
	content: ReactNode | string;
	openDialog: boolean;
	setOpenDialog: (open: boolean) => void;
	mobileOnly?: boolean;
	dialogContentClassName?: string;
	onOpenAutoFocus?: DialogPrimitive.DialogContentProps["onOpenAutoFocus"];
	onEscapeKeyDown?: (event: KeyboardEvent) => void;
}>;

export function ResponsiveDialog({
	children,
	content,
	openDialog,
	setOpenDialog,
	mobileOnly,
	dialogContentClassName,
	onOpenAutoFocus,
	onEscapeKeyDown,
}: DialogProps) {
	const isMobile = useIsMobile();

	if (mobileOnly || isMobile) {
		return (
			<Drawer.Root open={openDialog} onOpenChange={setOpenDialog}>
				<Drawer.Trigger className='sm:hidden' asChild>
					{children}
				</Drawer.Trigger>
				<Drawer.Portal>
					<Drawer.Overlay className='fixed inset-0 z-50 bg-black/50 backdrop-blur' />
					<Drawer.Content
						className='border-border-subtle bg-background fixed bottom-0 left-0 right-0 z-50 mt-24 rounded-t-[10px] border-t'
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
						<div className='bg-muted mx-auto my-4 h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block' />
						<div className='bg-background max-h-[80vh] min-h-[150px] w-full items-center justify-center overflow-auto align-middle'>
							{content}
						</div>
					</Drawer.Content>
					<Drawer.Overlay />
				</Drawer.Portal>
			</Drawer.Root>
		);
	}

	return (
		<Dialog open={openDialog} onOpenChange={setOpenDialog}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent
				className={cn(dialogContentClassName)}
				onOpenAutoFocus={onOpenAutoFocus}
				onEscapeKeyDown={onEscapeKeyDown}
			>
				{content}
			</DialogContent>
		</Dialog>
	);
}
