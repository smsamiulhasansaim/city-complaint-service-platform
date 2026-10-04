import { request } from "../client";
import type {
  CreateServiceInput,
  Service,
  UpdateServiceInput,
} from "../types";

export const servicesApi = {
  list(): Promise<Service[]> {
    return request<Service[]>("/services");
  },

  get(id: string): Promise<Service> {
    return request<Service>(`/services/${id}`);
  },

  create(token: string, input: CreateServiceInput): Promise<Service> {
    return request<Service>("/services", {
      method: "POST",
      body: input,
      token,
    });
  },

  update(
    token: string,
    id: string,
    input: UpdateServiceInput,
  ): Promise<Service> {
    return request<Service>(`/services/${id}`, {
      method: "PATCH",
      body: input,
      token,
    });
  },

  delete(
    token: string,
    id: string,
  ): Promise<
    | { deleted: true }
    | { softDeleted: true; service: Service }
  > {
    return request<{ deleted: true } | { softDeleted: true; service: Service }>(
      `/services/${id}`,
      { method: "DELETE", token },
    );
  },
};