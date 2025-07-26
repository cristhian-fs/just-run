import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { NewPeriodizationPlanFormData } from "@/shared/schemas";
import { userQueryOptions } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ResponsiveDialog } from "@/components/responsive-dialog";

import { createCustomPeriodization } from "../../api/create-custom-periodization";
import { CreatePeriodizationForm } from "./create-periodization-form";

export const CreatePeriodizationDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: user } = useQuery(userQueryOptions());

  if (!user) {
    return null;
  }

  const {
    mutate: createCustomPeriodizationMutate,
    isPending: isCreating,
    isSuccess,
  } = createCustomPeriodization();

  const handleSubmit = (data: NewPeriodizationPlanFormData) => {
    createCustomPeriodizationMutate({
      form: {
        baseValuePerWeek: data.baseValuePerWeek.toString(),
        race: data.race,
        startDate: data.startDate.toISOString(),
        unit: data.unit,
        weeklyFrequency: data.weeklyFrequency.toString(),
        weeks: data.weeks.toString(),
      },
    });
  };

  return (
    <ResponsiveDialog
      openDialog={dialogOpen}
      setOpenDialog={setDialogOpen}
      dialogContentClassName="p-0 gap-0"
      content={
        <>
          <DialogHeader className="p-6">
            <DialogTitle>Criar nova programação</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para gerar sua nova programação de
              treinos
            </DialogDescription>
          </DialogHeader>
          <CreatePeriodizationForm
            handleSubmit={handleSubmit}
            isCreating={isCreating}
            isSuccess={isSuccess}
          />
        </>
      }
    >
      <Button variant="gradient">Criar nova programação</Button>
    </ResponsiveDialog>
  );
};
