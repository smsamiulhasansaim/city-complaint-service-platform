"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth.store";
import type { LoginInput, RegisterInput, User } from "@/lib/api/types";

interface AuthEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

async function authFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const body = (await res.json().catch(() => null)) as AuthEnvelope<T> | null;

  if (!res.ok || !body?.success) {
    const message = body?.message ?? `Request failed (${res.status})`;
    throw new Error(message);
  }

  return body.data;
}

const ME_QUERY_KEY = ["auth", "me"] as const;

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user, initialized, setUser, setInitialized, clear } = useAuthStore();

  // Bootstrap: fetch current user once.
  useQuery<User | null>({
    queryKey: ME_QUERY_KEY,
    queryFn: async () => {
      try {
        const data = await authFetch<{ user: User } | User>("/api/auth/me", {
          method: "GET",
        });
        const nextUser =
          "user" in (data as object)
            ? (data as { user: User }).user
            : (data as User);
        setUser(nextUser);
        setInitialized(true);
        return nextUser;
      } catch {
        setUser(null);
        setInitialized(true);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const login = useMutation({
    mutationFn: (input: LoginInput) =>
      authFetch<{ user: User }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: (data) => {
      setUser(data.user);
      setInitialized(true);
      void queryClient.invalidateQueries();
      toast.success("Welcome back!");
      const home = getRoleHome(data.user);
      router.replace(home);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const register = useMutation({
    mutationFn: (input: RegisterInput) =>
      authFetch<{ user: User }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: (data) => {
      setUser(data.user);
      setInitialized(true);
      void queryClient.invalidateQueries();
      toast.success("Account created successfully");
      router.replace(getRoleHome(data.user));
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const logout = useCallback(async () => {
    try {
      await authFetch<null>("/api/auth/logout", { method: "POST" });
    } catch {
      /* best-effort */
    }
    clear();
    queryClient.clear();
    router.replace("/login");
  }, [clear, queryClient, router]);

  return {
    user,
    initialized,
    isAuthenticated: user !== null,
    role: user?.role ?? null,
    login,
    register,
    logout,
  };
}

function getRoleHome(user: User): string {
  switch (user.role) {
    case "ADMIN":
      return "/admin";
    case "AGENT":
      return "/provider";
    default:
      return "/dashboard";
  }
}