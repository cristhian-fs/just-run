import * as ProgressPrimitive from "@radix-ui/react-progress";
import type * as React from "react";
import { cn } from "@/lib/utils";

function VDOTProgress({
	className,
	value,
	...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
	return (
		<ProgressPrimitive.Root
			data-slot='progress'
			className={cn(
				"relative h-2 w-full overflow-hidden rounded-full",
				"bg-[linear-gradient(in_hsl_shorter_hue_90deg,_rgba(255,_0,_0,_0.2),_rgba(0,_255,_0,_0.2))]",
				className,
			)}
			{...props}
		>
			<ProgressPrimitive.Indicator
				data-slot='progress-indicator'
				className='h-full w-full flex-1 bg-[linear-gradient(in_hsl_shorter_hue_90deg,_red,_green)] transition-all'
				style={{ clipPath: `inset(0px ${100 - (value || 0)}% 0px 0px)` }}
			/>
		</ProgressPrimitive.Root>
	);
}

export { VDOTProgress };
