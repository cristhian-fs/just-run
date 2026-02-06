import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import { FormError } from "@/components/form-error";
import { FormSucess } from "@/components/form-sucess";
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
// schemas
import { authClient } from "@/lib/auth-client";
import { registerSchema } from "@/shared/schemas";
import { getErrorMessage } from "../auth-utils";
import { CardWrapper } from "./card-wrapper";

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const { isPending } = authClient.useSession();

  const onSubmit = async (values: RegisterFormData) => {
    setError("");
    setSuccess("");
    const { error } = await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.username,
        gender: "other",
        hasCompleteOnboarding: false,
        heightCm: 0,
        weightKg: 0,
        age: 18,
      },
      {
        onSuccess: () => {
          setSuccess("Registro concluido com sucesso!");
          navigate({ to: "/onboarding" });
        },
      },
    );
    if (error?.code) {
      setError(getErrorMessage(error.code));
    }
  };

  return (
    <CardWrapper
      headerLabel="Crie sua conta para comecar."
      backButtonLabel='Ja tem uma conta? Fazer login.'
      backButtonHref='/login'
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder='Seu nome'
                      type='text'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder='seuemail@exemplo.com'
                      type='email'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder='********'
                      type='password'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSucess message={success} />
          <Button type='submit' className='w-full' disabled={isPending}>
            Crie sua conta
          </Button>
          <span className='mt-4 text-sm'>
            Continuando, voce concorda com nossos{" "}
            <Link className='underline' to='/app'>
              termos de servico
            </Link>{" "}
            e{" "}
            <Link className='underline' to='/app'>
              politica de privacidade
            </Link>
            .
          </span>
        </form>
      </Form>
    </CardWrapper>
  );
};
