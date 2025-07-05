import * as dates from "date-arithmetic";
import {
  addDays,
  addMonths,
  addWeeks,
  format,
  getDay,
  parse,
  parseISO,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  Grid3X3,
  PlusIcon,
} from "lucide-react";
import {
  Calendar,
  dateFnsLocalizer,
  DateLocalizer,
  Navigate,
  NavigateAction,
  View,
  Views,
} from "react-big-calendar";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import TimeGrid from "react-big-calendar/lib/TimeGrid";

import { Button } from "@/components/ui/button";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./data-calendar.css";

import { useMemo, useState } from "react";

import { WorkoutSelect } from "@/shared/types";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";

import { WorkoutCard } from "../workouts/workout-card";

const locales = {
  "pt-BR": ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// CUSTOM WEEK
function MyWeek({
  date,
  localizer,
  max = localizer.endOf(new Date(), "day"),
  min = localizer.startOf(new Date(), "day"),
  scrollToTime = localizer.startOf(new Date(), "day"),
  ...props
}: {
  date: Date;
  localizer: DateLocalizer;
  max: Date;
  min: Date;
  scrollToTime: Date;
}) {
  const currRange = useMemo(
    () => MyWeek.range(date, { localizer }),
    [date, localizer],
  );

  return (
    <TimeGrid
      date={date}
      eventOffset={15}
      localizer={localizer}
      max={max}
      min={min}
      range={currRange}
      scrollToTime={scrollToTime}
      {...props}
    />
  );
}

MyWeek.range = (date: Date, { localizer }: { localizer: DateLocalizer }) => {
  const start = date;
  const end = dates.add(start, 2, "day");

  let current = start;
  const range = [];

  while (localizer.lte(current, end, "day")) {
    range.push(current);
    current = localizer.add(current, 1, "day");
  }

  return range;
};

MyWeek.navigate = (
  date: Date,
  action: NavigateAction,
  { localizer }: { localizer: DateLocalizer },
) => {
  switch (action) {
    case Navigate.PREVIOUS:
      return localizer.add(date, -3, "day");

    case Navigate.NEXT:
      return localizer.add(date, 3, "day");

    default:
      return date;
  }
};

MyWeek.title = (date: Date) => {
  return `My awesome week: ${date.toLocaleDateString()}`;
};

interface CustomToolBarProps {
  date: Date;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
  onView: (view: View) => void;
  workoutsLength: number;
  view: View;
}

const CustomToolBar = ({
  date,
  onNavigate,
  onView,
  workoutsLength,
  view,
}: CustomToolBarProps) => {
  return (
    <div className="flex w-full flex-col items-start justify-between gap-4 gap-x-2 rounded-t-lg border border-b-0 p-4 lg:w-auto lg:flex-row lg:items-center lg:justify-between">
      <div className="flex gap-x-2">
        <div className="flex flex-col overflow-hidden rounded-md border">
          <span className="bg-foreground text-background w-full px-3 py-1 text-center text-sm font-medium uppercase">
            {format(date, "LLL", { locale: ptBR })}
          </span>
          <div className="flex h-full w-full items-center justify-center px-3 py-1 text-center font-medium">
            <span>{format(date, "dd", { locale: ptBR })}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-x-2">
            <p className="capitalize">
              {format(date, "MMMM yyyy", { locale: ptBR })}
            </p>
            <Badge variant="outline">{workoutsLength} treinos</Badge>
          </div>
          <div className="flex items-center gap-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onNavigate("PREV")}
            >
              <ChevronLeft />
            </Button>
            <p className="text-sm">
              {format(date, "MMM dd',' yyyy", { locale: ptBR })}
            </p>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onNavigate("NEXT")}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex gap-x-2">
        <div className="hidden divide-x rounded-md border md:flex">
          <Button
            variant="ghost"
            size="icon"
            className={cn("rounded-none", view === "month" && "bg-muted")}
            onClick={() => onView("month")}
          >
            <Grid3X3 className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("rounded-none", view === "week" && "bg-muted")}
            onClick={() => onView("week")}
          >
            <Grid2X2 className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("rounded-none", view === "agenda" && "bg-muted")}
            onClick={() => onView("agenda")}
          >
            <CalendarRange className="size-4" />
          </Button>
        </div>
        <Button>
          <PlusIcon />
          Novo Treino
        </Button>
      </div>
    </div>
  );
};

interface DataCalendarProps {
  data: WorkoutSelect[];
}

export const DataCalendar = ({ data }: DataCalendarProps) => {
  const [value, setValue] = useState(
    data.length > 0 ? new Date(data[0].scheduledStart) : new Date(),
  );
  const [view, setView] = useState<View>(Views.WEEK);
  const { defaultDate, views } = useMemo(
    () => ({
      defaultDate: new Date(),
      views: {
        month: true,
        week: MyWeek,
        agenda: true,
      },
    }),
    [],
  );

  const isMobile = useIsMobile();

  const events = data.map((workout) => {
    return {
      ...workout,
      createdAt: parseISO(new Date(workout.createdAt).toISOString()),
      updatedAt: parseISO(new Date(workout.updatedAt).toISOString()),
      start: parseISO(workout.scheduledStart),
      end: parseISO(workout.scheduledStart),
    };
  });

  const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    if (view === "month") {
      switch (action) {
        case "PREV":
          setValue(subMonths(value, 1));
          break;
        case "NEXT":
          setValue(addMonths(value, 1));
          break;
        case "TODAY":
          setValue(new Date());
          break;
      }
    }
    if (view === "week") {
      switch (action) {
        case "PREV":
          setValue(subWeeks(value, 1));
          break;
        case "NEXT":
          setValue(addWeeks(value, 1));
          break;
        case "TODAY":
          setValue(new Date());
          break;
      }
    }
    if (view === "agenda") {
      switch (action) {
        case "PREV":
          setValue(subDays(value, 1));
          break;
        case "NEXT":
          setValue(addDays(value, 1));
          break;
        case "TODAY":
          setValue(new Date());
          break;
      }
    }
  };

  const getMinDate = () => {
    if (data.length === 0) return new Date();
    const firstItem = data[0];
    return firstItem?.scheduledStart
      ? new Date(firstItem.scheduledStart)
      : new Date();
  };

  const getMaxDate = () => {
    if (data.length === 0) return addWeeks(new Date(), 8);
    const lastItem = data[data.length - 1];
    return lastItem?.scheduledStart
      ? new Date(lastItem.scheduledStart)
      : addWeeks(new Date(), 8);
  };

  const min = getMinDate();
  const max = getMaxDate();

  return (
    <Calendar
      localizer={localizer}
      date={value}
      events={events}
      culture="pt-BR"
      defaultDate={defaultDate}
      views={views}
      defaultView={view}
      view={isMobile ? "agenda" : view}
      onView={setView}
      toolbar
      showAllEvents
      className="h-full"
      formats={{
        weekdayFormat: (date, culture, localizer) =>
          localizer?.format(date, "EEE", culture) ?? "",
        agendaDateFormat: (date, culture, localizer) =>
          localizer?.format(date, "EEEE',' dd 'de' MMMM", culture) ?? "",
      }}
      min={min}
      max={max}
      components={{
        eventWrapper: ({ event }) => <WorkoutCard workout={event} inCalendar />,
        toolbar: () => (
          <CustomToolBar
            date={value}
            onNavigate={handleNavigate}
            onView={setView}
            workoutsLength={data.length}
            view={view}
          />
        ),
        agenda: {
          event: ({ event }) => <WorkoutCard workout={event} inCalendar />,
        },
        timeGutterHeader: () => (
          <div className="flex h-8 w-full border-b">
            <Button
              variant="ghost"
              size="sm"
              className="h-full flex-1 rounded-none"
              disabled={value <= min}
              onClick={() => setValue(subDays(value, 1))}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-full flex-1 rounded-none"
              disabled={value >= max}
              onClick={() => setValue(addDays(value, 1))}
            >
              <ChevronRight />
            </Button>
          </div>
        ),
      }}
    />
  );
};
