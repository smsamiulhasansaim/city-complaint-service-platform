"use client";

import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { className, label, error, hint, id, rows = 4, ...rest },
    ref,
  ) {
    const autoId = useId();
    const textareaId = id ?? autoId;
    const errorId = error ? `${textareaId}-error` : undefined;
    const hintId = hint && !error ? `${textareaId}-hint` : undefined;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-1.5 block text-sm font-medium text-ink"
          >
            {label}
            {rest.required && (
              <span className="ml-1 text-danger" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          aria-invalid={error ? true : undefined}
          aria-describedby={cn(errorId, hintId) || undefined}
          className={cn(
            "w-full rounded-md border-2 bg-surface px-3 py-2 text-sm text-ink",
            "placeholder:text-ink-muted/60",
            "transition-colors outline-none resize-y",
            "focus:border-ink",
            "disabled:cursor-not-allowed disabled:bg-surface-2 disabled:opacity-70",
            error ? "border-danger" : "border-border-strong",
            className,
          )}
          {...rest}
        />

        {error ? (
          <p id={errorId} className="mt-1.5 text-xs text-danger">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="mt-1.5 text-xs text-ink-muted">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);