import { ModeToggle } from "./mode-toggle";

export function SiteHeader() {
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) bg-sidebar flex shrink-0 items-center gap-2 rounded-md border px-2 py-2 transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-2 lg:gap-2 lg:px-4">
        <h1 className="text-base font-medium">Dashboard</h1>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
