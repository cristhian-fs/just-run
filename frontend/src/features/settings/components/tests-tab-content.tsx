import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import type { TestFormData } from "@/shared/schemas";
import { useAddTest } from "../api/use-add-test";
import { RunningTestForm } from "./running-test-form";

export const TestsTabContent = () => {
	const { mutate: addTest, isPending: isAddingTest, isSuccess } = useAddTest();

	const handleSubmit = (data: TestFormData) => {
		addTest({
			form: {
				distanceM: data.distanceM.toString(),
				time: data.time,
				testType: data.testType,
				goal: data.goal,
				testDate: data.testDate.toISOString(),
				weeklyFrequency: data.weeklyFrequency.toString(),
				raceDate: data.raceDate?.toString(),
			},
		});
	};

	return (
		<TabsContent value='tests' className='px-4 py-8 md:px-8'>
			<h4 className='text-lg md:text-xl'>Meus Testes</h4>
			<p className='text-muted-foreground mt-2 text-base'>
				Adicione testes de corrida já feitos para que sejam criadas suas zonas
				de treinamento.
			</p>
			<Separator className='my-6' />
			<RunningTestForm
				onSubmit={handleSubmit}
				isLoading={isAddingTest}
				isSuccess={isSuccess}
			/>
		</TabsContent>
	);
};
