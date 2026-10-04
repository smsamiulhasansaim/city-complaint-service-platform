import { ListSkeleton, Skeleton, StatGridSkeleton } from "@/components/ui/Skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-80" />
      <StatGridSkeleton count={4} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
      <ListSkeleton rows={4} />
    </div>
  );
}