import { motion } from "motion/react";
import bgImage from "@/assets/onboarding-bg-image.webp";
import { Button } from "@/components/ui/button";
import { useMultiStepForm } from "./stepped-form";

export function OnboardingHome() {
	const { nextStep } = useMultiStepForm();

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			className='flex items-end h-screen p-6 pb-28 relative'
		>
			<div className='absolute inset-0'>
				<img
					src={bgImage}
					alt='Background cover'
					className='w-full object-cover object-bottom saturate-0 opacity-20'
				/>
				<span className='absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-10% from-background to-transparent' />
			</div>
			<div className='flex flex-col gap-y-4 relative z-10 max-w-lg'>
				<h1 className='text-3xl font-semibold'>
					Seus melhores treinos com o{" "}
					<span className='text-primary'>JustRun!</span>
				</h1>
				<p className='text-muted-foreground'>
					Ajudamos você a alcançar seus objetivos de corrida e analisar seu
					progresso ao longo do tempo
				</p>
				<Button className={"w-full"} onClick={() => nextStep()}>
					Começar agora
				</Button>
			</div>
		</motion.div>
	);
}
