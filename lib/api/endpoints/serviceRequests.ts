import { request, requestWithMeta } from "../client";
import type {
  AssignInput,
  CreateServiceRequestInput,
  ListServiceRequestsQuery,
  ServiceRequest,
  ServiceRequestStatusInput,
  ServiceRequestsListResult,
} from "../types";

export const serviceRequestsApi = {
  async list(
    token: string,
    query: ListServiceRequestsQuery,
  ): Promise<ServiceRequestsListResult> {
    const { data, meta } = await requestWithMeta<ServiceRequest[]>(
      "/service-requests",
      {
        token,
        query: {
          page: query.page,
          limit: query.limit,
          status: query.status,
          serviceId: query.serviceId,
          sort: query.sort,
        },
      },
    );
    return {
      requests: data,
      total: meta?.total ?? data.length,
    };
  },

  get(token: string, id: string): Promise<ServiceRequest> {
    return request<ServiceRequest>(`/service-requests/${id}`, { token });
  },

  create(
    token: string,
    input: CreateServiceRequestInput,
  ): Promise<ServiceRequest> {
    return request<ServiceRequest>("/service-requests", {
      method: "POST",
      body: input,
      token,
    });
  },

  assign(
    token: string,
    id: string,
    input: AssignInput,
  ): Promise<ServiceRequest> {
    return request<ServiceRequest>(`/service-requests/${id}/assign`, {
      method: "PATCH",
      body: input,
      token,
    });
  },

  changeStatus(
    token: string,
    id: string,
    input: ServiceRequestStatusInput,
  ): Promise<ServiceRequest> {
    return request<ServiceRequest>(`/service-requests/${id}/status`, {
      method: "PATCH",
      body: input,
      token,
    });
  },
};