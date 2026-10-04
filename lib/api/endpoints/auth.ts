import { request } from "../client";
import type {
  AuthResponse,
  ChangePasswordInput,
  GoogleLoginInput,
  LoginInput,
  RegisterInput,
  UpdateMeInput,
  User,
} from "../types";

export const authApi = {
  register(input: RegisterInput): Promise<AuthResponse> {
    return request<AuthResponse>("/auth/register", {
      method: "POST",
      body: input,
    });
  },

  login(input: LoginInput): Promise<AuthResponse> {
    return request<AuthResponse>("/auth/login", {
      method: "POST",
      body: input,
    });
  },

  google(input: GoogleLoginInput): Promise<AuthResponse> {
    return request<AuthResponse>("/auth/google", {
      method: "POST",
      body: input,
    });
  },

  me(token: string): Promise<User> {
    return request<User>("/auth/me", { token });
  },

  updateMe(token: string, input: UpdateMeInput): Promise<User> {
    return request<User>("/auth/me", {
      method: "PATCH",
      body: input,
      token,
    });
  },

  changePassword(
    token: string,
    input: ChangePasswordInput,
  ): Promise<{ updated: boolean }> {
    return request<{ updated: boolean }>("/auth/me/password", {
      method: "PATCH",
      body: input,
      token,
    });
  },
};