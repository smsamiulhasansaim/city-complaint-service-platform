import { ListSkeleton, Skeleton, StatGridSkeleton } from "@/components/ui/Skeleton";

export default function ProviderLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-80" />
      <StatGridSkeleton count={4} />
      <ListSkeleton rows={4} />
    </div>
  );
}