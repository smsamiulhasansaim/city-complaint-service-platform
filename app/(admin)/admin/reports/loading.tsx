import { Skeleton, StatGridSkeleton } from "@/components/ui/Skeleton";

export default function AdminReportsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-56" />
      <StatGridSkeleton count={4} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    </div>
  );
}