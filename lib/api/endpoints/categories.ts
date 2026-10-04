import { request } from "../client";
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../types";

export const categoriesApi = {
  list(): Promise<Category[]> {
    return request<Category[]>("/categories");
  },

  get(id: string): Promise<Category> {
    return request<Category>(`/categories/${id}`);
  },

  create(token: string, input: CreateCategoryInput): Promise<Category> {
    return request<Category>("/categories", {
      method: "POST",
      body: input,
      token,
    });
  },

  update(
    token: string,
    id: string,
    input: UpdateCategoryInput,
  ): Promise<Category> {
    return request<Category>(`/categories/${id}`, {
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
    | { softDeleted: true; category: Category }
  > {
    return request<{ deleted: true } | { softDeleted: true; category: Category }>(
      `/categories/${id}`,
      { method: "DELETE", token },
    );
  },
};