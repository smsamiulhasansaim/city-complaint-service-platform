"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";

import { AuthCard } from "@/components/auth/AuthCard";
import { DemoLoginGrid } from "@/components/auth/DemoLoginGrid";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import {
  loginSchema,
  type LoginFormValues,
} from "@/lib/validations/auth.schema";
import type { Role } from "@/lib/api/types";

export default function LoginPage() {
  const { login } = useAuth();
  const [activeRole, setActiveRole] = useState<Role | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit((values) => {
    setActiveRole(null);
    login.mutate(values);
  });

  const isPending = isSubmitting || login.isPending;

  return (
    <AuthCard
      title="Welcome back 👋"
      subtitle="Login to your account"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-ink underline underline-offset-4 hover:text-accent"
          >
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <PasswordInput
          label="Password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={isPending && activeRole === null}
          rightIcon={<ArrowRight className="h-4 w-4" />}
        >
          Login
        </Button>
      </form>

      <div className="my-5">
        <GoogleLoginButton />
      </div>

      <DemoLoginGrid
        onSubmit={(credentials) => login.mutate(credentials)}
        isPending={isPending}
        activeRole={activeRole}
        onActiveRoleChange={setActiveRole}
      />
    </AuthCard>
  );
}