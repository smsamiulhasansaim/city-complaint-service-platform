"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useApiAuth } from "./useApiAuth";
import { useAuthStore } from "@/stores/auth.store";
import type { ChangePasswordInput, UpdateMeInput, User } from "@/lib/api/types";

export function useUpdateMe() {
  const { call } = useApiAuth();
  const setUser = useAuthStore((s) => s.setUser);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateMeInput) =>
      call<User>("/auth/me", { method: "PATCH", body: input }),
    onSuccess: (user) => {
      setUser(user);
      void qc.invalidateQueries({ queryKey: ["auth", "me"] });
      toast.success("Profile updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useChangePassword() {
  const { call } = useApiAuth();
  return useMutation({
    mutationFn: (input: ChangePasswordInput) =>
      call<{ updated: boolean }>("/auth/me/password", {
        method: "PATCH",
        body: input,
      }),
    onSuccess: () => {
      toast.success("Password updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}