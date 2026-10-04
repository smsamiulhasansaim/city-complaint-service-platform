import { requestWithMeta, request } from "../client";
import type {
  CreateAgentInput,
  ListUsersQuery,
  UpdateRoleInput,
  UpdateUserStatusInput,
  User,
  UsersListResult,
} from "../types";

export const usersApi = {
  async list(token: string, query: ListUsersQuery): Promise<UsersListResult> {
    const { data, meta } = await requestWithMeta<User[]>("/users", {
      token,
      query: {
        page: query.page,
        limit: query.limit,
        role: query.role,
        status: query.status,
        search: query.search,
      },
    });
    return {
      users: data,
      total: meta?.total ?? data.length,
    };
  },

  get(token: string, id: string): Promise<User> {
    return request<User>(`/users/${id}`, { token });
  },

  createAgent(token: string, input: CreateAgentInput): Promise<User> {
    return request<User>("/users/agents", {
      method: "POST",
      body: input,
      token,
    });
  },

  updateRole(token: string, id: string, input: UpdateRoleInput): Promise<User> {
    return request<User>(`/users/${id}/role`, {
      method: "PATCH",
      body: input,
      token,
    });
  },

  updateStatus(
    token: string,
    id: string,
    input: UpdateUserStatusInput,
  ): Promise<User> {
    return request<User>(`/users/${id}/status`, {
      method: "PATCH",
      body: input,
      token,
    });
  },

  delete(token: string, id: string): Promise<{ deleted: boolean }> {
    return request<{ deleted: boolean }>(`/users/${id}`, {
      method: "DELETE",
      token,
    });
  },
};