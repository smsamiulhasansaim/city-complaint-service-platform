"use client";

import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/client";

type QueryProviderProps = {
  children: React.ReactNode;
};

function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export default function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              // Never retry auth / validation / not-found errors.
              if (isApiError(error)) {
                if ([400, 401, 403, 404, 409, 422].includes(error.status)) {
                  return false;
                }
              }
              return failureCount < 1;
            },
          },
          mutations: {
            retry: false,
          },
        },
        queryCache: new QueryCache({
          onError: (error) => {
            if (!isApiError(error)) return;
            // Suppress global toast for 401 — handled by auth guard.
            if (error.status === 401) return;
            toast.error(error.message);
          },
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}