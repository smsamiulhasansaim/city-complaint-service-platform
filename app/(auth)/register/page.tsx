"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone, User as UserIcon } from "lucide-react";

import { AuthCard } from "@/components/auth/AuthCard";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/lib/validations/auth.schema";

export default function RegisterPage() {
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      ward: "",
      address: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    registerUser.mutate({
      name: values.name,
      email: values.email,
      password: values.password,
      phone: values.phone || undefined,
      ward: values.ward || undefined,
      address: values.address || undefined,
    });
  });

  const isPending = isSubmitting || registerUser.isPending;

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join the City Complaint & Service Platform"
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-ink underline underline-offset-4 hover:text-accent"
          >
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Input
          label="Full name"
          autoComplete="name"
          placeholder="Rakib Hasan"
          leftIcon={<UserIcon className="h-4 w-4" />}
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <PasswordInput
            label="Password"
            autoComplete="new-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordInput
            label="Confirm password"
            autoComplete="new-password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Phone (optional)"
            autoComplete="tel"
            placeholder="+880 1XXX XXXXXX"
            leftIcon={<Phone className="h-4 w-4" />}
            error={errors.phone?.message}
            {...register("phone")}
          />
          <Input
            label="Ward (optional)"
            placeholder="Ward 5"
            leftIcon={<MapPin className="h-4 w-4" />}
            error={errors.ward?.message}
            {...register("ward")}
          />
        </div>

        <Input
          label="Address (optional)"
          autoComplete="street-address"
          placeholder="12 Lake Road"
          error={errors.address?.message}
          {...register("address")}
        />

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={isPending}
          rightIcon={<ArrowRight className="h-4 w-4" />}
        >
          Create account
        </Button>
      </form>

      <div className="my-5">
        <GoogleLoginButton />
      </div>

      <p className="text-center text-xs text-ink-muted">
        Agent accounts are provisioned by an administrator.
      </p>
    </AuthCard>
  );
}