import { Skeleton } from "@/components/ui/Skeleton";

export default function AuthLoading() {
  return (
    <div className="w-full max-w-md rounded-lg border-2 border-ink bg-surface p-8 shadow-[6px_6px_0_0_var(--color-ink)]">
      <div className="mb-6 flex flex-col items-center gap-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-11 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-11 w-full" />
        </div>
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
      <div className="mt-6 space-y-3">
        <Skeleton className="h-4 w-32 mx-auto" />
        <div className="grid grid-cols-2 gap-2.5">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
}