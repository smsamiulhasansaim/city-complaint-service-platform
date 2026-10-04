"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        classNames: {
          toast:
            "rounded-md border-2 border-ink bg-surface text-ink shadow-[3px_3px_0_0_var(--color-ink)]",
          title: "text-sm font-semibold",
          description: "text-xs text-ink-muted",
          actionButton: "bg-ink text-surface",
          cancelButton: "bg-surface-2 text-ink",
          error: "border-danger",
          success: "border-success",
          warning: "border-warning",
          info: "border-info",
        },
      }}
    />
  );
}