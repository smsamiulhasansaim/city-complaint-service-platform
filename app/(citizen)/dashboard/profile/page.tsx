"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, MapPin, Phone, User as UserIcon } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useChangePassword, useUpdateMe } from "@/hooks/useMe";

const profileSchema = z.object({
  name: z.string().min(2, "Name is required").max(100, "Name is too long"),
  phone: z
    .string()
    .max(20, "Phone is too long")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .max(255, "Address is too long")
    .optional()
    .or(z.literal("")),
  ward: z.string().max(50, "Ward is too long").optional().or(z.literal("")),
});

type ProfileValues = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .max(100, "Password is too long"),
    confirmNewPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((d) => d.newPassword === d.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

type PasswordValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, initialized } = useAuth();
  const updateMe = useUpdateMe();
  const changePassword = useChangePassword();

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: {
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      address: user?.address ?? "",
      ward: user?.ward ?? "",
    },
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  if (!initialized || !user) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const onProfileSubmit = profileForm.handleSubmit((values) => {
    updateMe.mutate({
      name: values.name,
      phone: values.phone || undefined,
      address: values.address || undefined,
      ward: values.ward || undefined,
    });
  });

  const onPasswordSubmit = passwordForm.handleSubmit((values, e) => {
    const form = e?.target as HTMLFormElement | undefined;
    changePassword.mutate(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      },
      { onSuccess: () => { passwordForm.reset(); form?.reset(); } },
    );
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Profile & settings
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Manage your personal information and account security.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Email
              </dt>
              <dd className="mt-1 flex items-center gap-2 text-sm text-ink">
                <Mail className="h-4 w-4 text-ink-muted" aria-hidden="true" />
                {user.email}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Role
              </dt>
              <dd className="mt-1 inline-flex items-center gap-2 rounded-full border border-border-strong px-2 py-0.5 text-xs font-semibold text-ink">
                <UserIcon className="h-3.5 w-3.5" aria-hidden="true" />
                {user.role}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Auth provider
              </dt>
              <dd className="mt-1 text-sm text-ink">{user.authProvider}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Member since
              </dt>
              <dd className="mt-1 text-sm text-ink">
                {new Date(user.createdAt).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onProfileSubmit} className="space-y-4" noValidate>
            <Input
              label="Name"
              leftIcon={<UserIcon className="h-4 w-4" />}
              error={profileForm.formState.errors.name?.message}
              {...profileForm.register("name")}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Phone"
                leftIcon={<Phone className="h-4 w-4" />}
                error={profileForm.formState.errors.phone?.message}
                {...profileForm.register("phone")}
              />
              <Input
                label="Ward"
                leftIcon={<MapPin className="h-4 w-4" />}
                error={profileForm.formState.errors.ward?.message}
                {...profileForm.register("ward")}
              />
            </div>
            <Input
              label="Address"
              error={profileForm.formState.errors.address?.message}
              {...profileForm.register("address")}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={
                  profileForm.formState.isSubmitting || updateMe.isPending
                }
              >
                Save changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {user.authProvider === "LOCAL" && (
        <Card>
          <CardHeader>
            <CardTitle>Change password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onPasswordSubmit} className="space-y-4" noValidate>
              <PasswordInput
                label="Current password"
                autoComplete="current-password"
                error={passwordForm.formState.errors.currentPassword?.message}
                {...passwordForm.register("currentPassword")}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <PasswordInput
                  label="New password"
                  autoComplete="new-password"
                  error={passwordForm.formState.errors.newPassword?.message}
                  {...passwordForm.register("newPassword")}
                />
                <PasswordInput
                  label="Confirm new password"
                  autoComplete="new-password"
                  error={
                    passwordForm.formState.errors.confirmNewPassword?.message
                  }
                  {...passwordForm.register("confirmNewPassword")}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  isLoading={
                    passwordForm.formState.isSubmitting ||
                    changePassword.isPending
                  }
                >
                  Update password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}