import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useMultiStepForm } from "./stepped-form";

export default function ProgressIndicator() {
	const { steps, currentStepIndex, goToStep } = useMultiStepForm();

	const isMobile = useIsMobile();

	const filteredSteps = steps.filter((step) => {
		if (isMobile) return true;
		return !step.mobileOnly;
	});

	return (
		<div className='flex items-center w-full justify-center mb-10'>
			<div className='w-full space-y-8'>
				<div className='relative flex justify-between w-full'>
					<div className='absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-muted'>
						<motion.div
							className='h-full bg-green-600 dark:bg-green-400'
							initial={{ width: "0%" }}
							animate={{
								width: `${(currentStepIndex / (filteredSteps.length - 1)) * 100}%`,
							}}
							transition={{ duration: 0.3, ease: "easeInOut" }}
						/>
					</div>
					{filteredSteps.map((step, index) => {
						const isCompleted = currentStepIndex > index;
						const isCurrent = currentStepIndex === index;

						return (
							<div key={step.position} className='relative z-10'>
								<motion.button
									onClick={() => goToStep(step.position - 1)}
									className={cn(
										"flex items-center justify-center bg-background px-2 gap-1 text-muted-foreground transition-colors",
										isCompleted && "text-green-600 dark:text-green-400",
										isCurrent && "text-foreground",
									)}
								>
									<AnimatePresence mode='popLayout' initial={false}>
										<motion.div
											key={isCompleted ? "check" : "step"}
											className='size-8 rounded-full bg-muted flex items-center justify-center'
											initial={{ scale: 0.6, opacity: 0 }}
											animate={{ scale: 1, opacity: 1 }}
											exit={{ scale: 0.6, opacity: 0 }}
											transition={{ duration: 0.2 }}
										>
											{isCompleted ? (
												<Check className='size-4' />
											) : (
												<step.icon className='size-4' />
											)}
										</motion.div>
										<span className='text-sm'>{step.title}</span>
									</AnimatePresence>
								</motion.button>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
