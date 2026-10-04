"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useApiAuth } from "./useApiAuth";
import { queryKeys } from "@/lib/api/queryKeys";
import type {
  CheckoutSession,
  ConfirmPaymentResult,
  ListPaymentsQuery,
  Payment,
} from "@/lib/api/types";

export function usePayments(query: ListPaymentsQuery) {
  const { call } = useApiAuth();
  return useQuery({
    queryKey: queryKeys.payments.list(query),
    queryFn: async () => {
      const items = await call<Payment[]>("/payments", {
        query: {
          page: query.page,
          limit: query.limit,
          status: query.status,
          purpose: query.purpose,
        },
      });
      return { items, total: items.length };
    },
  });
}

export function usePayment(id: string | null) {
  const { call } = useApiAuth();
  return useQuery({
    queryKey: queryKeys.payments.detail(id ?? ""),
    queryFn: () => call<Payment>(`/payments/${id}`),
    enabled: Boolean(id),
  });
}

export function useCheckoutServiceRequest() {
  const { call } = useApiAuth();
  return useMutation({
    mutationFn: (serviceRequestId: string) =>
      call<CheckoutSession>(
        `/payments/service-requests/${serviceRequestId}/checkout`,
        { method: "POST" },
      ),
  });
}

export function useConfirmPayment() {
  const { call } = useApiAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) =>
      call<ConfirmPaymentResult>("/payments/confirm", {
        method: "POST",
        body: { sessionId },
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.payments.all });
      void qc.invalidateQueries({ queryKey: queryKeys.serviceRequests.all });
      void qc.invalidateQueries({ queryKey: queryKeys.complaints.all });
      void qc.invalidateQueries({ queryKey: queryKeys.dashboard.citizen });
      toast.success("Payment confirmed");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}