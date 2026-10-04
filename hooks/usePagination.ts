"use client";

import { useMemo } from "react";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/lib/utils/constants";

export interface UsePaginationOptions {
  page?: number;
  limit?: number;
  total: number;
}

export function usePagination({
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT,
  total,
}: UsePaginationOptions) {
  return useMemo(() => {
    const safeLimit = Math.max(1, Math.min(limit, 100));
    const totalPages = Math.max(1, Math.ceil(total / safeLimit));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const skip = (safePage - 1) * safeLimit;
    const hasPrev = safePage > 1;
    const hasNext = safePage < totalPages;

    return {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages,
      skip,
      hasPrev,
      hasNext,
    };
  }, [page, limit, total]);
}