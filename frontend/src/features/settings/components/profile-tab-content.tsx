import { useQuery } from "@tanstack/react-query";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  UserBasicSettingsData,
  userBasicSettingsSchema,
} from "@/shared/schemas";
import { userQueryOptions } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";

import { useUpdateProfile } from "../api/use-update-profile";

export const ProfileTabContent = () => {
  const { data: user } = useQuery(userQueryOptions());

  const gender = (user?.gender ?? "male") as "male" | "female";
  const form = useForm<UserBasicSettingsData>({
    resolver: zodResolver(userBasicSettingsSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      gender: gender,
      age: user?.age ?? 18,
      weightKg: user?.weightKg ?? 70,
      heightCm: user?.heightCm ?? 170,
    },
  });

  const { mutate: updateProfileMutate, isPending: isUpdatingProfile } =
    useUpdateProfile();

  const onSubmit = (data: UserBasicSettingsData) => {
    updateProfileMutate({
      form: {
        age: data.age.toString(),
        email: data.email,
        gender: data.gender,
        heightCm: data.heightCm.toString(),
        name: data.name,
        weightKg: data.weightKg.toString(),
        trainingLevel: data.trainingLevel,
      },
    });
  };

  return (
    <TabsContent value="profile" className="px-4 py-8 md:px-8">
      <h4 className="text-lg md:text-xl">Meu perfil</h4>
      <p className="text-muted-foreground mt-2 text-base">
        Gerencie as informações de sua conta, como nome, idade, altura, peso,
        etc.
      </p>
      <Separator className="my-6" />
      <p className="text-base md:text-lg">Configurações básicas</p>
      <p className="text-muted-foreground mt-2">
        Atualize suas informações do perfil
      </p>
      <Form {...form}>
        <form
          className="mt-8 max-w-lg space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seu email</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seu gênero</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione seu gênero" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Homem</SelectItem>
                    <SelectItem value="female">Mulher</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sua idade</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      className="appearance-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weightKg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seu peso (kg)</FormLabel>
                  <FormControl>
                    <Input placeholder="70kg" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="heightCm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sua altura (cm)</FormLabel>
                  <FormControl>
                    <Input placeholder="175cm" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="trainingLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Qual o seu nivel atual?</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Iniciante, Intermediário, Avançado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="beginner">Iniciante</SelectItem>
                    <SelectItem value="intermediate">Intermediário</SelectItem>
                    <SelectItem value="advanced">Avançado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-x-2">
            <Button type="submit" disabled={isUpdatingProfile}>
              {isUpdatingProfile ? "Salvando..." : "Salvar"}
            </Button>
            <Button type="reset" variant="outline">
              Cancelar
            </Button>
          </div>
        </form>
      </Form>
    </TabsContent>
  );
};
