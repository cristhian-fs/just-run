import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { BackButton } from "@/features/auth/components/back-button";
import { Header } from "@/features/auth/components/header";

export const ErrorCard = () => {
	return (
		<Card className='w-[400px] shadow-md'>
			<CardHeader>
				<Header label='Oops! Something went wrong' />
			</CardHeader>
			<CardFooter>
				<BackButton label='Back to login' href='/auth/login' />
			</CardFooter>
		</Card>
	);
};
