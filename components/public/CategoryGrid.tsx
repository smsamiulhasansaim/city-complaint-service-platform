import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import type { Category } from "@/lib/api/types";
import { EmptyState } from "@/components/ui/EmptyState";

export interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) {
    return (
      <EmptyState
        icon={<Layers className="h-6 w-6" aria-hidden="true" />}
        title="No categories yet"
        description="Categories will appear here once the city adds them."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/login?category=${cat.id}`}
          className="group flex flex-col rounded-lg border-2 border-border bg-surface p-5 transition-all hover:border-ink hover:shadow-[4px_4px_0_0_var(--color-ink)]"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/25 text-ink">
              <Layers className="h-4 w-4" aria-hidden="true" />
            </span>
            <ArrowRight
              className="h-4 w-4 text-ink-muted transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </div>
          <h3 className="mt-4 text-base font-semibold text-ink">{cat.name}</h3>
          {cat.description && (
            <p className="mt-1 line-clamp-2 text-sm text-ink-muted">
              {cat.description}
            </p>
          )}
        </Link>
      ))}
    </div>
  );
}