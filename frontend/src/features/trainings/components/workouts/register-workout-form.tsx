import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { TimeInput } from "@/components/time-input";
import { TimeValidation } from "@/components/time-validation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
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
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
	type RegisterWorkoutFormData,
	registerWorkoutSchema,
} from "@/shared/schemas";
import type { TTrainingType } from "@/shared/types";
import { RUN_TYPE_MAPPING } from "./workout-card";

interface RegisterWorkoutFormProps {
	runType: TTrainingType;
	onSubmit?: (data: RegisterWorkoutFormData) => void;
	isRegistering?: boolean;
}

export function RegisterWorkoutForm({
	runType,
	onSubmit,
	isRegistering,
}: RegisterWorkoutFormProps) {
	const form = useForm<RegisterWorkoutFormData>({
		resolver: zodResolver(registerWorkoutSchema),
		defaultValues: {
			runType,
			date: new Date(),
			time: new Date().toISOString().slice(0, 5),
			workoutType: "Treino completo",
			duration: "00:00:00",
			distance: "",
			perceivedEffort: "5",
			observations: "",
		},
	});

	// Watch duration and distance for pace calculation
	const duration = useWatch({ control: form.control, name: "duration" });
	const distance = useWatch({ control: form.control, name: "distance" });

	// Calculate pace in real time
	const calculatedPace = useMemo(() => {
		if (!duration || !distance) return "00:00";

		const distanceNum = Number.parseFloat(distance);
		if (isNaN(distanceNum) || distanceNum <= 0) return "00:00";

		// parse duration (HH:SS)
		const durationParts = duration.split(":");
		if (durationParts.length !== 3) return "00:00";

		const hours = Number.parseInt(durationParts[0]);
		const minutes = Number.parseInt(durationParts[1]);
		const seconds = Number.parseInt(durationParts[2]);

		if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return "00:00";

		const totalSeconds = hours * 3600 + minutes * 60 + seconds;
		if (totalSeconds <= 0) return "00:00";

		// Calculate pace (seconds per km)
		const paceInSeconds = totalSeconds / distanceNum;
		const paceMinutes = Math.floor(paceInSeconds / 60);
		const paceSecondsRemainder = Math.floor(paceInSeconds % 60);

		return `${paceMinutes.toString().padStart(2, "0")}:${paceSecondsRemainder.toString().padStart(2, "0")}`;
	}, [duration, distance]);

	function handleSubmit(values: RegisterWorkoutFormData) {
		onSubmit?.(values);
	}

	const buttonCopy = {
		idle: "Registrar treino",
		loading: <Loader size={16} color='rgba(255, 255, 255, 0.65)' />,
	};

	return (
		<Card className='rounded-none border-0 bg-transparent p-0 px-0 shadow-none dark:bg-transparent'>
			<CardHeader className='px-0'>
				<CardTitle>Registrar Treino</CardTitle>
				<CardDescription>
					Preencha os dados do seu treino de corrida
				</CardDescription>
			</CardHeader>
			<CardContent className='px-0'>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className='space-y-6'
					>
						{/* Date and Time */}
						<div className='grid grid-cols-2 gap-4'>
							<FormField
								control={form.control}
								name='date'
								render={({ field }) => (
									<FormItem className='flex flex-col'>
										<FormLabel>Dia do treino</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={"outline"}
														className={cn(
															"w-full pl-3 text-left font-normal",
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
							<FormField
								control={form.control}
								name='time'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Horário</FormLabel>
										<FormControl>
											<Input
												step='60'
												placeholder='00:00'
												className='appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
												type='time'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Workout Type */}
						<FormField
							control={form.control}
							name='workoutType'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tipo de Treino</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger className='w-full'>
												<SelectValue placeholder='Selecione o tipo de treino' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value='Treino completo'>
												Treino completo
											</SelectItem>
											<SelectItem value='treino pulado'>
												Treino pulado
											</SelectItem>
											<SelectItem value='treino parcial'>
												Treino parcial
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Run Type (Disabled) */}
						<FormField
							control={form.control}
							name='runType'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tipo de Corrida</FormLabel>
									<Select disabled value={field.value}>
										<FormControl>
											<SelectTrigger className='w-full'>
												<SelectValue />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value={runType}>
												{RUN_TYPE_MAPPING[runType] || runType}
											</SelectItem>
										</SelectContent>
									</Select>
									<FormDescription>
										Tipo de corrida definido automaticamente
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Duration and Distance */}
						<div className='grid grid-cols-2 items-start gap-4'>
							<FormField
								control={form.control}
								name='duration'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Duração da corrida</FormLabel>
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
										{duration && (
											<AnimatePresence mode='wait' initial={false}>
												<TimeValidation time={duration} format={"long"} />
											</AnimatePresence>
										)}
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='distance'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Distância (km)</FormLabel>
										<FormControl>
											<Input
												type='number'
												step='0.01'
												placeholder='0.00'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Calculated Pace */}
						<div className='bg-muted rounded-lg p-4'>
							<div className='text-muted-foreground mb-1 text-sm font-medium'>
								Pace Calculado
							</div>
							<div className='text-2xl font-bold'>{calculatedPace} min/km</div>
						</div>

						{/* Perceived Effort */}
						<FormField
							control={form.control}
							name='perceivedEffort'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Esforço Percebido: {field.value}/10</FormLabel>
									<FormControl>
										<Slider
											min={1}
											max={10}
											step={1}
											value={field.value ? [Number(field.value)] : [5]}
											onValueChange={(value) =>
												form.setValue("perceivedEffort", String(value[0]))
											}
											className='w-full'
										/>
									</FormControl>
									<div className='text-muted-foreground flex justify-between text-xs'>
										<span>Muito Fácil</span>
										<span>Máximo</span>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Observations */}
						<FormField
							control={form.control}
							name='observations'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Observações</FormLabel>
									<FormControl>
										<Textarea
											placeholder='Adicione suas observações sobre o treino...'
											className='min-h-[100px]'
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Opcional: Como se sentiu, condições climáticas, etc.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type='submit' className='w-full' disabled={isRegistering}>
							<AnimatePresence mode='popLayout' initial={false}>
								<motion.span
									transition={{ type: "spring", duration: 0.3, bounce: 0 }}
									initial={{ opacity: 0, y: -25 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 25 }}
									key={isRegistering ? "loading" : "idle"}
								>
									{buttonCopy[isRegistering ? "loading" : "idle"]}
								</motion.span>
							</AnimatePresence>
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
