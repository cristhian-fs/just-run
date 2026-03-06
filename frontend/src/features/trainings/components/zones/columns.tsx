import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { percent } from "@/lib/utils";
import type { TraningZoneSelect, TTrainingType } from "@/shared/types";
import { RunTypeBadge } from "../run-type-badge";
import { RUN_TYPE_MAPPING } from "@/lib/consts";

export const Columns: ColumnDef<TraningZoneSelect>[] = [
  {
    accessorKey: "name",
    header: "Nome da Zona",
  },
  {
    accessorKey: "vo2Percentage",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          VO2 % / treino
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = parseFloat(row.getValue("vo2Percentage"));
      return <div className='px-2.5'>{percent.format(value)}</div>;
    },
  },
  {
    accessorKey: "workouts",
    header: "Treinos",
    cell: ({ row }) => {
      const workouts = row.original.workouts as TTrainingType[];
      return (
        <div className='flex flex-wrap gap-1'>
          {workouts?.map((workout) => (
            <RunTypeBadge variant={workout} key={workout}>
              {RUN_TYPE_MAPPING[workout]}
            </RunTypeBadge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "pace",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ritmo (km/min)
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => <div className='px-2.5'>{row.original.pace}</div>,
  },
  {
    accessorKey: "velocity",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Velocidade (km/h)
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => <div className='px-2.5'>{row.original.velocity}</div>,
  },
  {
    accessorKey: "cardioFrequency",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          FC (bpm)
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className='px-2.5'>{row.original.cardioFrequency}</div>
    ),
  },
  {
    accessorKey: "vo2Max",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          VO2 máximo (ml/kg/min)
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => <div className='px-2.5'>{row.original.vo2Max}</div>,
  },
];
