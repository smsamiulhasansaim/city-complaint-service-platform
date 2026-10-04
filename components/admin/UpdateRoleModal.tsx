"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Select, type SelectOption } from "@/components/ui/Select";
import { useUpdateUserRole } from "@/hooks/useUsers";
import { ROLE_LABELS, ROLES } from "@/lib/utils/constants";
import type { Role, User } from "@/lib/api/types";

const schema = z.object({ role: z.enum(["CITIZEN", "AGENT", "ADMIN"]) });
type FormValues = z.infer<typeof schema>;

const options: SelectOption[] = ROLES.map((r) => ({
  value: r,
  label: ROLE_LABELS[r],
}));

export interface UpdateRoleModalProps {
  user: User | null;
  onClose: () => void;
}

export function UpdateRoleModal({ user, onClose }: UpdateRoleModalProps) {
  const update = useUpdateUserRole();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: "CITIZEN" },
  });

  useEffect(() => {
    if (user) reset({ role: user.role });
  }, [user, reset]);

  const onSubmit = handleSubmit((values) => {
    if (!user) return;
    update.mutate(
      { id: user.id, input: { role: values.role as Role } },
      { onSuccess: () => onClose() },
    );
  });

  return (
    <Modal
      open={user !== null}
      onClose={() => !update.isPending && onClose()}
      title={`Change role for ${user?.name ?? ""}`}
      description="Role changes take effect immediately on the user's next request."
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={update.isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="update-role-form"
            isLoading={update.isPending}
          >
            Save
          </Button>
        </>
      }
    >
      <form
        id="update-role-form"
        onSubmit={onSubmit}
        className="space-y-4"
        noValidate
      >
        <Select
          label="Role"
          required
          options={options}
          error={errors.role?.message}
          {...register("role")}
        />
      </form>
    </Modal>
  );
}