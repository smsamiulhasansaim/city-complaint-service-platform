import { Skeleton, StatGridSkeleton, ListSkeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      <div className="mt-6">
        <StatGridSkeleton count={4} />
      </div>
      <div className="mt-6">
        <ListSkeleton rows={4} />
      </div>
    </div>
  );
}