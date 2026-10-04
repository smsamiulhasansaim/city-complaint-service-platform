"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, MapPin, Phone, User as UserIcon } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { useCreateAgent } from "@/hooks/useUsers";

const schema = z.object({
  name: z.string().min(2, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
  phone: z.string().max(20).optional().or(z.literal("")),
  ward: z.string().max(50).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export interface CreateAgentModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateAgentModal({ open, onClose }: CreateAgentModalProps) {
  const create = useCreateAgent();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", phone: "", ward: "" },
  });

  const onSubmit = handleSubmit((values) => {
    create.mutate(
      {
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone || undefined,
        ward: values.ward || undefined,
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      },
    );
  });

  return (
    <Modal
      open={open}
      onClose={() => !create.isPending && onClose()}
      title="Create agent account"
      description="Agents receive assigned complaints and service requests."
      footer={
        <>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={create.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-agent-form"
            isLoading={create.isPending}
          >
            Create agent
          </Button>
        </>
      }
    >
      <form
        id="create-agent-form"
        onSubmit={onSubmit}
        className="space-y-4"
        noValidate
      >
        <Input
          label="Full name"
          required
          leftIcon={<UserIcon className="h-4 w-4" />}
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Email"
          type="email"
          required
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />
        <PasswordInput
          label="Temporary password"
          required
          error={errors.password?.message}
          {...register("password")}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Phone (optional)"
            leftIcon={<Phone className="h-4 w-4" />}
            error={errors.phone?.message}
            {...register("phone")}
          />
          <Input
            label="Ward (optional)"
            leftIcon={<MapPin className="h-4 w-4" />}
            error={errors.ward?.message}
            {...register("ward")}
          />
        </div>
      </form>
    </Modal>
  );
}