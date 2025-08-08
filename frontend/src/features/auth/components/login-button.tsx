import { useNavigate } from "@tanstack/react-router";

interface LoginButtonProps {
	children: React.ReactNode;
	mode?: "modal" | "redirect";
	asChild?: boolean;
}

export const LoginButton = ({
	children,
	mode = "redirect",
}: LoginButtonProps) => {
	const navigate = useNavigate();

	const onClick = () => navigate({ to: "/login" });

	if (mode === "modal") {
		return <span>TODO: Implement Modal</span>;
	}

	return (
		<button type='button' className='cursor-pointer' onClick={onClick}>
			{children}
		</button>
	);
};
