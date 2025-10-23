import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useFormContext } from "react-hook-form";
import type { z } from "zod";
import { TimeInput } from "@/components/time-input";
import { TimeValidation } from "@/components/time-validation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { trainingGoals } from "@/shared/constants/training.constants";
import type { TestFormSchema } from "@/shared/schemas";
import { NextButton } from "./next-button";
import PrevButton from "./prev-button";
import { useMultiStepForm } from "./stepped-form";

const GOAL_MAPPING = {
	startRunning: "Começar na corrida",
	improveHealth: "Melhorar a saude",
	loseWeight: "Perder peso",
	runFaster: "Correr mais rápido",
	runLonger: "Correr distâncias maiores",
	race5K: "Corrida de 5K",
	race10K: "Corrida de 10K",
	race21K: "Meia maratona (21K)",
	race42K: "Maratona (42K)",
};

const RACE_OPTIONS = ["race5K", "race10K", "race21K", "race42K"];

export function OnboardingStep2() {
	const { control, watch } = useFormContext<z.infer<typeof TestFormSchema>>();
	const { nextStep } = useMultiStepForm();

	const goal = watch("goal");
	const time = watch("time");

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			className='space-y-4 flex flex-col min-h-screen justify-end p-6 py-24 md:min-h-0 md:py-0 md:justify-start'
		>
			<div className='max-w-lg mx-auto mb-8 flex flex-col md:items-center md:text-center text-pretty'>
				<h1 className='text-3xl font-semibold'>Teste de corrida</h1>
				<p className='text-muted-foreground'>
					Adicione seu último teste de corrida/resultado de alguma prova
				</p>
			</div>
			<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
				<FormField
					control={control}
					name='testType'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tipo de teste realizado</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger className='w-full flex-1'>
										<SelectValue placeholder='Teste' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value='1600m'>1600m</SelectItem>
									<SelectItem value='2400m'>2400m</SelectItem>
									<SelectItem value='3000m'>3000m</SelectItem>
									<SelectItem value='3200m'>3200m</SelectItem>
									<SelectItem value='5000m'>5000m</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name='testDate'
					render={({ field }) => (
						<FormItem className='flex flex-col'>
							<FormLabel>Dia do teste</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant={"outline"}
											className={cn(
												"w-full max-w-[240px] pl-3 text-left font-normal",
												!field.value && "text-muted-foreground",
											)}
										>
											{field.value ? (
												format(field.value, "PPP", {
													locale: ptBR,
												})
											) : (
												<span>Selecione uma data</span>
											)}
											<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className='w-auto p-0' align='start'>
									<Calendar
										mode='single'
										selected={field.value}
										onSelect={field.onChange}
										disabled={(date) =>
											date > new Date() || date < new Date("1900-01-01")
										}
										captionLayout='dropdown'
										locale={ptBR}
									/>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
			<FormField
				control={control}
				name='distanceM'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Distância percorrida (m)</FormLabel>
						<FormControl>
							<Input placeholder='3000m' type='number' {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={control}
				name='time'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Tempo gasto (hh:mm:ss)</FormLabel>
						<FormControl>
							<TimeInput
								format='long'
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
								placeholder='00:00:00'
								inputMode='numeric'
							/>
						</FormControl>
						{time && (
							<AnimatePresence mode='wait' initial={false}>
								<TimeValidation time={time} format={"long"} />
							</AnimatePresence>
						)}
					</FormItem>
				)}
			/>
			<FormField
				control={control}
				name='weeklyFrequency'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Quantos dias da semana treina?</FormLabel>
						<Select onValueChange={field.onChange}>
							<FormControl>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='Dias da semana' />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value='3'>3 dias</SelectItem>
								<SelectItem value='4'>4 dias</SelectItem>
								<SelectItem value='5'>5 dias</SelectItem>
								<SelectItem value='6'>6 dias</SelectItem>
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name='goal'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Qual o seu objetivo na corrida?</FormLabel>
						<Select onValueChange={field.onChange} defaultValue={field.value}>
							<FormControl>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='Dias da semana' />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								{trainingGoals.map((goal) => (
									<SelectItem key={goal} value={goal}>
										{GOAL_MAPPING[goal]}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>
			{RACE_OPTIONS.includes(goal) && (
				<FormField
					control={control}
					name='raceDate'
					render={({ field }) => (
						<FormItem className='flex flex-col'>
							<FormLabel>Dia da corrida</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant={"outline"}
											className={cn(
												"animate-in fade-in-80 w-[240px] pl-3 text-left font-normal",
												!field.value && "text-muted-foreground",
											)}
										>
											{field.value ? (
												format(field.value, "PPP", {
													locale: ptBR,
												})
											) : (
												<span>Selecione a data da corrida</span>
											)}
											<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className='w-auto p-0' align='start'>
									<Calendar
										mode='single'
										selected={field.value}
										onSelect={field.onChange}
										disabled={(date) => date < new Date()}
										captionLayout='dropdown'
										locale={ptBR}
									/>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>
			)}
			<div className='flex flex-col items-center gap-2'>
				<PrevButton />
				<NextButton onClick={() => nextStep()} />
			</div>
		</motion.div>
	);
}
