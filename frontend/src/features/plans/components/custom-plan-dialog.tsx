import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { AnimatedStateButton } from "@/components/animated-state-button";
import { ResponsiveDialog } from "@/components/responsive-dialog";
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
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
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
import { getUserPlanning } from "@/features/trainings/api/get-user-planning";
import {
	MAPPED_RACE_METERS_DISTANCE,
	RACE_DISTANCE_KEYS,
	TEST_DISTANCE_MAPPING,
} from "@/features/vdot/types";
import { useConfirm } from "@/hooks/use-confirm";
import { cn } from "@/lib/utils";
import {
	type CustomPlanningFormData,
	customPlanningSchema,
} from "@/shared/schemas";
import { activateCustomPlan } from "../api/activate-custom-plan";

export const CustomizePlanDialog = ({ planId }: { planId: string }) => {
	const [dialogOpen, setDialogOpen] = useState(false);

	const [OverrideCurrentPlanningDialog, confirm] = useConfirm({
		title: "Sobreescrever treino atual?",
		message:
			"Você já tem um plano de treinamento ativo, deseja sobreescrever? Não se preocupe, se já tiver concluido algum treino, seu histórico será salvo e poderá ser acessado na tela de histórico.",
		buttonCopy: {
			idle: "Ativar plano",
			loading: <Loader size={16} color='rgba(255, 255, 255, 0.65)' />,
		},
		variant: "gradient",
	});

	const planning = useQuery({
		queryKey: ["planning"],
		queryFn: () => getUserPlanning(),
	});

	const form = useForm<CustomPlanningFormData>({
		resolver: zodResolver(customPlanningSchema),
	});

	// Watch duration and distance for pace calculation
	const duration = useWatch({ control: form.control, name: "duration" });
	const { mutate: activatePlan, isPending, isSuccess } = activateCustomPlan();

	const handleSubmit = async (values: CustomPlanningFormData) => {
		// Construir o `form` dinamicamente para omitir campos vazios/inválidos
		const formData: {
			startDate: string;
			endDate?: string;
			distance?: string; // Opcional, só inclui se válido
			duration?: string; // Opcional, só inclui se válido
		} = {
			startDate: values.startDate.toDateString(),
			endDate: values.endDate ? values.endDate?.toDateString() : undefined,
		};

		if (values.distance) {
			formData.distance = values.distance.toString();
		}

		if (values.duration) {
			formData.duration = values.duration.toString();
		}

		if (planning.data?.length) {
			await confirm();
		}

		activatePlan({
			param: { planId },
			form: formData,
		});

		setDialogOpen(false);
	};

	return (
		<>
			<OverrideCurrentPlanningDialog />
			<ResponsiveDialog
				openDialog={dialogOpen}
				setOpenDialog={setDialogOpen}
				dialogContentClassName='p-0 gap-0'
				content={
					<>
						<DialogHeader className='p-6'>
							<DialogTitle>Personalizar plano</DialogTitle>
							<DialogDescription>
								Personalize seu plano alterando as semanas de treino e/ou
								alterando a intensidade de treino.
							</DialogDescription>
						</DialogHeader>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(handleSubmit)}>
								<div className='px-6 pb-6 space-y-8'>
									<Card>
										<CardHeader>
											<CardTitle className='text-lg'>
												Performance de corrida recente
											</CardTitle>
											<CardDescription>
												Coloque os dados da sua corrida mais recente para
												calcular seu VDOT
											</CardDescription>
										</CardHeader>
										<CardContent>
											<div className='grid grid-cols-1 items-start gap-4'>
												<FormField
													control={form.control}
													name='distance'
													render={({ field }) => (
														<FormItem>
															<FormLabel>Distancia</FormLabel>
															<Select
																onValueChange={field.onChange}
																defaultValue={field.value}
															>
																<FormControl>
																	<SelectTrigger className='w-full'>
																		<SelectValue placeholder='Selecione uma distancia' />
																	</SelectTrigger>
																</FormControl>
																<SelectContent>
																	{RACE_DISTANCE_KEYS.toReversed().map(
																		(distance) => (
																			<SelectItem
																				key={distance}
																				value={String(
																					MAPPED_RACE_METERS_DISTANCE[
																						distance
																					] as number,
																				)}
																			>
																				{TEST_DISTANCE_MAPPING[distance]}
																			</SelectItem>
																		),
																	)}
																</SelectContent>
															</Select>
														</FormItem>
													)}
												/>
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
																	<TimeValidation
																		time={duration}
																		format={"long"}
																	/>
																</AnimatePresence>
															)}
														</FormItem>
													)}
												/>
											</div>
										</CardContent>
									</Card>
									<FormField
										control={form.control}
										name='startDate'
										render={({ field }) => (
											<FormItem className='flex flex-col'>
												<FormLabel>Dia de inicio</FormLabel>
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
																	<span>Selecione a data de inicio</span>
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
									<FormField
										control={form.control}
										name='endDate'
										render={({ field }) => (
											<FormItem className='flex flex-col'>
												<FormLabel>Dia da corrida</FormLabel>
												<FormDescription>
													Se tiver alguma corrida antes da duração total do
													plano, o plano se ajustará para essa corrida
												</FormDescription>
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
															selected={
																field.value ?? addDays(new Date(), 8 * 7)
															}
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
								</div>
								<DialogFooter className='border-border bg-secondary/25 dark:bg-secondary/50 justify-end border-t px-6 pb-4 pt-4'>
									<AnimatedStateButton
										type='submit'
										isLoading={isPending}
										isSuccess={isSuccess}
										buttonCopy={{
											idle: "Aplicar para esse plano",
											success: "Plano cadastrado com sucesso!",
											loading: (
												<Loader size={16} color='rgba(255, 255, 255, 0.65)' />
											),
										}}
									></AnimatedStateButton>
								</DialogFooter>
							</form>
						</Form>
					</>
				}
			>
				<Button variant='outline'>Personalizar plano</Button>
			</ResponsiveDialog>
		</>
	);
};
