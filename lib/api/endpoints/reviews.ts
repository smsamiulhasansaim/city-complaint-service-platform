import { request } from "../client";
import type { CreateReviewInput, Review } from "../types";

export const reviewsApi = {
  create(token: string, input: CreateReviewInput): Promise<Review> {
    return request<Review>("/reviews", {
      method: "POST",
      body: input,
      token,
    });
  },

  /** Public: get the single review for a complaint (or null). */
  getByComplaint(complaintId: string): Promise<Review | null> {
    return request<Review | null>(`/reviews/complaint/${complaintId}`);
  },

  delete(token: string, id: string): Promise<{ deleted: boolean }> {
    return request<{ deleted: boolean }>(`/reviews/${id}`, {
      method: "DELETE",
      token,
    });
  },
};