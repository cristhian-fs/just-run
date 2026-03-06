import type { LucideIcon } from "lucide-react";
import type { JSX } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

const FOOTER_VARIANT_CLASSNAMES = {
  default: "text-muted-foreground",
  success:
    "text-emerald-700 dark:text-emerald-400 border-emerald-500 dark:border-emerald-800 bg-emerald-500/10 dark:bg-emerald-500/5",
  warning:
    "text-amber-700 dark:text-amber-400 border-amber-500 dark:border-amber-800 bg-amber-500/10 dark:bg-amber-500/5",
  danger:
    "text-rose-700 dark:text-rose-400 border-rose-500 dark:border-rose-800 bg-rose-500/10 dark:bg-rose-500/5",
};

interface DashboardCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  action?: JSX.Element;
  footerVariant?: "default" | "success" | "warning" | "danger";
  footerClassName?: string;
  footerContent?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export const DashboardCard = ({
  title,
  description,
  icon,
  children,
  action,
  footerVariant = "default",
  contentClassName,
  footerClassName,
  footerContent,
  className,
}: DashboardCardProps) => {
  const Icon = icon;

  return (
    <Card
      className={cn(
        "bg-card-outter @container/card gap-0 p-[2px] border-none shadow-none",
        className,
      )}
    >
      <div className='relative z-[2] flex flex-1 flex-col rounded-xl'>
        <CardHeader className='has-data-[slot=card-action]:grid-cols-1 @sm/card:has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-action]:gap-2 items-center gap-0 px-3 py-3'>
          <div className='flex items-center justify-start gap-x-2 max-w-full min-w-0 w-full'>
            {Icon && (
              <div className="shrink-0 flex-1 grow-0">
                <Icon className='text-muted-foreground size-4' />
              </div>
            )}
            <div className='flex flex-col justify-center items-start gap-y-0.5 max-w-full min-w-0 w-full'>
              <CardTitle>{title}</CardTitle>
              {description && (
                <CardDescription className='truncate max-w-full min-w-0 w-full block'>
                  {description}
                </CardDescription>
              )}
            </div>
          </div>
          {action && (
            <CardAction className='@sm/card:col-start-2 @sm/card:row-start-1 @sm/card:justify-self-end col-start-auto row-span-2 row-start-auto self-auto justify-self-auto'>
              {action}
            </CardAction>
          )}
        </CardHeader>
        <CardContent className={cn("flex-1 px-[calc(0.75rem_-_2px)] py-3 border bg-card rounded-lg", contentClassName)}>
          {children}
        </CardContent>
      </div>
      {footerContent && (
        <CardFooter
          className={cn(
            "-mt-[calc(var(--radius)_+_4px)] flex items-center justify-between rounded-b-xl px-[calc(0.75rem_-_2px)] py-2 pt-[calc((var(--radius)_+_4px)*1.5)]",
            FOOTER_VARIANT_CLASSNAMES[footerVariant],
            footerClassName,
          )}
        >
          {footerContent}
        </CardFooter>
      )}
    </Card>
  );
};
