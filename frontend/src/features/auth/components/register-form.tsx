import { useState } from "react";
import { Link } from "@tanstack/react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { registerSchema } from "@/shared/schemas";
// schemas
import { authClient } from "@/lib/auth-client";
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
import { FormError } from "@/components/form-error";
import { FormSucess } from "@/components/form-sucess";

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

  const { isPending } = authClient.useSession();

  const onSubmit = async (values: RegisterFormData) => {
    setError("");
    setSuccess("");
    await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.username,
        gender: "other",
        hasCompleteOnboarding: false,
        heightCm: 0,
        weightKg: 0,
      },
      {
        onSuccess: () => {
          setSuccess("Registration successful!");
          toast.success("Registration successful!");
        },
        onError: (error) => {
          setError(error.error.message);
        },
      },
    );
  };

  return (
    <CardWrapper
      headerLabel="Let's create your new account to get started."
      backButtonLabel="Already signed up? Sign in."
      backButtonHref="/login"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="John Doe"
                      type="text"
                    />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="johndoe@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="********"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSucess message={success} />
          <Button type="submit" className="w-full" disabled={isPending}>
            Create an account
          </Button>
          <span className="mt-4 text-sm">
            By continuing, you agree to our{" "}
            <Link className="underline" to="/">
              Terms of Service
            </Link>{" "}
            &{" "}
            <Link className="underline" to="/">
              Privacy Policy
            </Link>
            .
          </span>
        </form>
      </Form>
    </CardWrapper>
  );
};
