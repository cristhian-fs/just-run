import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

const timeMessage = {
	short: {
		minutes: {
			invalid: "Minutos devem estar entre 0 e 59.",
			required: "Os minutos são obrigatórios.",
		},
		seconds: {
			invalid: "Segundos devem estar entre 0 e 59.",
			required: "Os segundos são obrigatórios.",
		},
	},
	long: {
		hours: {
			invalid: "Horas devem estar entre 0 e 23.",
			required: "As horas são obrigatórias.",
		},
		minutes: {
			invalid: "Minutos devem estar entre 0 e 59.",
			required: "Os minutos são obrigatórios.",
		},
		seconds: {
			invalid: "Segundos devem estar entre 0 e 59.",
			required: "Os segundos são obrigatórios.",
		},
	},
};

export function TimeValidation({
	time,
	format,
}: {
	time: string;
	format: "short" | "long";
}) {
	const [hours, minutes, seconds] = time.split(":").map(Number);

	const getValueByField = (field: "hours" | "minutes" | "seconds") => {
		if (field === "hours") return hours;
		if (field === "minutes") return minutes;
		return seconds;
	};

	const getValidationMessage = (field: "minutes" | "seconds" | "hours") => {
		const value = getValueByField(field);
		if (Number.isNaN(value) && format === "long")
			return timeMessage[format][field].required;
		if (Number.isNaN(value) && format === "short" && field !== "hours")
			return timeMessage.short[field].required;

		if (
			(field === "minutes" || field === "seconds") &&
			(value < 0 || value > 59)
		)
			return timeMessage[format][field].invalid;

		return undefined;
	};

	const fields: ("hours" | "minutes" | "seconds")[] =
		format === "long"
			? ["hours", "minutes", "seconds"]
			: ["minutes", "seconds"];

	return (
		<motion.div
			className='flex w-full gap-x-2'
			initial={{ opacity: 0, height: 0 }}
			animate={{ opacity: 1, height: "auto" }}
			exit={{ opacity: 0, height: 0 }}
			transition={{ duration: 0.2 }}
			key='time'
		>
			{fields.map((field) => {
				const message = getValidationMessage(field);
				const value = getValueByField(field);
				const isFilled = !Number.isNaN(value);
				const isValid = !message && isFilled;

				return (
					<div
						key={field}
						className='flex flex-col items-center gap-y-1 flex-1'
					>
						<span
							className={cn(
								"h-[2px] w-full rounded-full transition-colors bg-muted",
								isValid ? "bg-emerald-500" : "bg-red-500",
							)}
						/>
						<AnimatePresence mode='wait' initial={false}>
							<motion.span
								key='message'
								className='text-xs text-destructive text-center'
								initial={{ opacity: 0, y: 4 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -4 }}
								transition={{ duration: 0.2 }}
							>
								{message}
							</motion.span>
						</AnimatePresence>
					</div>
				);
			})}
		</motion.div>
	);
}
