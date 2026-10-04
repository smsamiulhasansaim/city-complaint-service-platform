"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Star } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useApiAuth } from "@/hooks/useApiAuth";
import { queryKeys } from "@/lib/api/queryKeys";
import { cn } from "@/lib/utils/cn";
import {
  reviewSchema,
  type ReviewValues,
} from "@/lib/validations/complaint.schema";
import type { Review } from "@/lib/api/types";

export interface ReviewFormProps {
  complaintId: string;
  existingReview: Review | null;
}

export function ReviewForm({ complaintId, existingReview }: ReviewFormProps) {
  const { call } = useApiAuth();
  const qc = useQueryClient();
  const [hover, setHover] = useState<number | null>(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: ReviewValues) =>
      call<Review>("/reviews", {
        method: "POST",
        body: { complaintId, ...values },
      }),
    onSuccess: () => {
      toast.success("Review submitted");
      void qc.invalidateQueries({
        queryKey: queryKeys.complaints.detail(complaintId),
      });
      void qc.invalidateQueries({
        queryKey: queryKeys.reviews.byComplaint(complaintId),
      });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (existingReview) {
    return (
      <div className="rounded-lg border-2 border-border bg-surface p-4">
        <p className="text-sm font-semibold text-ink">Your review</p>
        <div className="mt-2 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              // biome-ignore lint/suspicious/noArrayIndexKey: static star row
              key={i}
              className={cn(
                "h-4 w-4",
                i < existingReview.rating
                  ? "fill-gold text-gold"
                  : "text-border-strong",
              )}
              aria-hidden="true"
            />
          ))}
          <span className="ml-2 text-sm font-medium text-ink">
            {existingReview.rating}/5
          </span>
        </div>
        <p className="mt-3 text-sm text-ink">{existingReview.comment}</p>
      </div>
    );
  }

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-lg border-2 border-border bg-surface p-4"
      noValidate
    >
      <div>
        <p className="text-sm font-semibold text-ink">
          Rate the resolution
        </p>
        <p className="mt-1 text-xs text-ink-muted">
          Your feedback helps us improve the service.
        </p>
      </div>

      <Controller
        control={control}
        name="rating"
        render={({ field }) => (
          <div
            className="flex items-center gap-1"
          >
            {[1, 2, 3, 4, 5].map((n) => {
              const active = (hover ?? field.value) >= n;
              return (
                <button
                  key={n}
                  type="button"
                  aria-label={`Rate ${n} out of 5`}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => field.onChange(n)}
                  className="rounded p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  <Star
                    className={cn(
                      "h-6 w-6 transition-colors",
                      active
                        ? "fill-gold text-gold"
                        : "text-border-strong hover:text-gold",
                    )}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
            <span className="ml-2 text-sm text-ink-muted">
              {field.value > 0 ? `${field.value}/5` : "Select a rating"}
            </span>
          </div>
        )}
      />
      {errors.rating?.message && (
        <p className="text-xs text-danger">{errors.rating.message}</p>
      )}

      <Textarea
        label="Comment"
        required
        rows={4}
        placeholder="What went well? What could be better?"
        error={errors.comment?.message}
        {...register("comment")}
      />

      <div className="flex justify-end">
        <Button type="submit" isLoading={mutation.isPending}>
          Submit review
        </Button>
      </div>
    </form>
  );
}