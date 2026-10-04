import { request, requestWithMeta } from "../client";
import type {
  AddComplaintUpdateInput,
  AssignInput,
  Complaint,
  ComplaintStatusInput,
  ComplaintUpdate,
  ComplaintsListResult,
  CreateComplaintInput,
  ListComplaintsQuery,
  UpdateComplaintInput,
} from "../types";

export const complaintsApi = {
  async list(
    token: string,
    query: ListComplaintsQuery,
  ): Promise<ComplaintsListResult> {
    const { data, meta } = await requestWithMeta<Complaint[]>("/complaints", {
      token,
      query: {
        page: query.page,
        limit: query.limit,
        status: query.status,
        categoryId: query.categoryId,
        priority: query.priority,
        ward: query.ward,
        search: query.search,
        sort: query.sort,
      },
    });
    return {
      complaints: data,
      total: meta?.total ?? data.length,
    };
  },

  get(token: string, id: string): Promise<Complaint> {
    return request<Complaint>(`/complaints/${id}`, { token });
  },

  create(token: string, input: CreateComplaintInput): Promise<Complaint> {
    return request<Complaint>("/complaints", {
      method: "POST",
      body: input,
      token,
    });
  },

  update(
    token: string,
    id: string,
    input: UpdateComplaintInput,
  ): Promise<Complaint> {
    return request<Complaint>(`/complaints/${id}`, {
      method: "PATCH",
      body: input,
      token,
    });
  },

  delete(token: string, id: string): Promise<{ deleted: boolean }> {
    return request<{ deleted: boolean }>(`/complaints/${id}`, {
      method: "DELETE",
      token,
    });
  },

  assign(token: string, id: string, input: AssignInput): Promise<Complaint> {
    return request<Complaint>(`/complaints/${id}/assign`, {
      method: "PATCH",
      body: input,
      token,
    });
  },

  changeStatus(
    token: string,
    id: string,
    input: ComplaintStatusInput,
  ): Promise<Complaint> {
    return request<Complaint>(`/complaints/${id}/status`, {
      method: "PATCH",
      body: input,
      token,
    });
  },

  addUpdate(
    token: string,
    id: string,
    input: AddComplaintUpdateInput,
  ): Promise<ComplaintUpdate> {
    return request<ComplaintUpdate>(`/complaints/${id}/updates`, {
      method: "POST",
      body: input,
      token,
    });
  },

  listUpdates(token: string, id: string): Promise<ComplaintUpdate[]> {
    return request<ComplaintUpdate[]>(`/complaints/${id}/updates`, { token });
  },
};