import { request, requestWithMeta } from "../client";
import type {
  CheckoutSession,
  ConfirmPaymentInput,
  ConfirmPaymentResult,
  ListPaymentsQuery,
  Payment,
  PaymentsListResult,
} from "../types";

export const paymentsApi = {
  /** Start a Stripe Checkout Session for a service request (citizen only). */
  checkoutServiceRequest(
    token: string,
    serviceRequestId: string,
  ): Promise<CheckoutSession> {
    return request<CheckoutSession>(
      `/payments/service-requests/${serviceRequestId}/checkout`,
      { method: "POST", token },
    );
  },

  /** Start a Stripe Checkout Session to expedite a complaint (citizen only). */
  expediteComplaint(
    token: string,
    complaintId: string,
  ): Promise<CheckoutSession> {
    return request<CheckoutSession>(
      `/payments/complaints/${complaintId}/expedite`,
      { method: "POST", token },
    );
  },

  /** Confirm a session after the user returns from Stripe. */
  confirm(token: string, input: ConfirmPaymentInput): Promise<ConfirmPaymentResult> {
    return request<ConfirmPaymentResult>("/payments/confirm", {
      method: "POST",
      body: input,
      token,
    });
  },

  async list(
    token: string,
    query: ListPaymentsQuery,
  ): Promise<PaymentsListResult> {
    const { data, meta } = await requestWithMeta<Payment[]>("/payments", {
      token,
      query: {
        page: query.page,
        limit: query.limit,
        status: query.status,
        purpose: query.purpose,
      },
    });
    return {
      payments: data,
      total: meta?.total ?? data.length,
      page: meta?.page ?? query.page ?? 1,
      limit: meta?.limit ?? query.limit ?? 10,
    };
  },

  get(token: string, id: string): Promise<Payment> {
    return request<Payment>(`/payments/${id}`, { token });
  },
};