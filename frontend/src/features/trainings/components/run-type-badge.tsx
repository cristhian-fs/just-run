import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";
import type { TTrainingType } from "@/shared/types";

const trainingVariantMap = {
	FARTLEK:
		"border-orange-600 bg-orange-500/5 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 [a&]:hover:bg-orange-600/90",
	PROGRESSIVE_RUN:
		"border-amber-600 bg-amber-500/5 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 [a&]:hover:bg-amber-600/90",
	THRESHOLD_RUN:
		"border-rose-600 bg-rose-500/5 dark:bg-rose-500/10  text-rose-700 dark:text-rose-400 [a&]:hover:bg-rose-600/90",
	LONG_RUN:
		"border-sky-600 bg-sky-500/5 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 [a&]:hover:bg-sky-600/90",
	EASY_RUN:
		"border-emerald-600 bg-emerald-500/5 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 [a&]:hover:bg-emerald-600/90",
	RECOVERY_RUN:
		"border-slate-600 bg-slate-500/5 dark:bg-slate-500/10 text-slate-700 dark:text-slate-400 [a&]:hover:bg-slate-600/90",
	INTERVAL:
		"border-violet-600 bg-violet-500/5 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 [a&]:hover:bg-violet-600/90",
	REPETITION:
		"border-teal-600 bg-teal-500/5 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 [a&]:hover:bg-teal-600/90",
	REST: "border-slate-600 bg-slate-500/5 dark:bg-slate-500/10 text-slate-700 dark:text-slate-400 [a&]:hover:bg-slate-600/90",
} as const satisfies Record<TTrainingType, string>;

const runTypeBadgeVariants = cva(
	"inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-sm font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
	{
		variants: {
			variant: trainingVariantMap,
		},
		defaultVariants: {
			variant: "EASY_RUN",
		},
	},
);

function RunTypeBadge({
	className,
	variant,
	asChild = false,
	...props
}: React.ComponentProps<"span"> &
	VariantProps<typeof runTypeBadgeVariants> & { asChild?: boolean }) {
	const Comp = asChild ? Slot : "span";

	return (
		<Comp
			data-slot='run-type-badge'
			className={cn(runTypeBadgeVariants({ variant }), className)}
			{...props}
		/>
	);
}

export { RunTypeBadge, runTypeBadgeVariants };
