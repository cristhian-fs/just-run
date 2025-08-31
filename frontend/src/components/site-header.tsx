import { useLocation } from "@tanstack/react-router";
import { ModeToggle } from "./mode-toggle";

export function SiteHeader() {
	const location = useLocation();
	const locationName =
		location.pathname.split("/")[2]?.split("-").join(" ") || "Home";
	const locationCamelCased =
		locationName.charAt(0).toUpperCase() + locationName.slice(1);

	return (
		<header className='group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) bg-sidebar flex h-12 shrink-0 items-center gap-2 rounded-md border px-2 py-2 transition-[width,height] ease-linear'>
			<div className='flex h-full w-full items-center gap-0 pl-2 lg:gap-2'>
				<h1 className='text-base font-medium'>{locationCamelCased}</h1>
				<div className='ml-auto flex items-center gap-2'>
					<ModeToggle />
				</div>
			</div>
		</header>
	);
}
