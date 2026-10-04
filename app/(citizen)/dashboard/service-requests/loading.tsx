import { ListSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function ServiceRequestsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-24 w-full" />
      <ListSkeleton rows={5} />
    </div>
  );
}