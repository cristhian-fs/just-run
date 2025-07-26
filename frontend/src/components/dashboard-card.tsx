import { JSX } from "react";

import { type LucideIcon } from "lucide-react";

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
  icon: LucideIcon;
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
        "bg-card-outter @container/card gap-0 border-none p-[1px] shadow-none",
        className,
      )}
    >
      <div className="bg-card relative z-[2] flex flex-1 flex-col rounded-xl border shadow-sm">
        <CardHeader className="has-data-[slot=card-action]:grid-cols-1 @sm/card:has-data-[slot=card-action]:grid-cols-[1fr_auto] items-center gap-2 border-b px-4 py-4 pb-0">
          <div className="flex items-center gap-x-2">
            <div className="bg-background shadow-xs rounded-md border p-3">
              <Icon className="text-muted-foreground size-4" />
            </div>
            <div className="flex flex-col justify-center gap-y-0.5">
              <CardTitle>{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </div>
          </div>
          {action && (
            <CardAction className="@sm/card:col-start-2 @sm/card:row-start-1 @sm/card:justify-self-end col-start-auto row-span-2 row-start-auto self-auto justify-self-auto">
              {action}
            </CardAction>
          )}
        </CardHeader>
        <CardContent className={cn("flex-1 px-4 py-4", contentClassName)}>
          {children}
        </CardContent>
      </div>
      {footerContent && (
        <CardFooter
          className={cn(
            "-mt-[calc(var(--radius)_+_4px)] flex items-center justify-between rounded-b-xl border border-t-0 px-4 py-2 pt-[calc((var(--radius)_+_4px)*1.5)]",
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
