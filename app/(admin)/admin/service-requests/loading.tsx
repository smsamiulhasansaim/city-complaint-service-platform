import { ListSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function AdminServiceRequestsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-20 w-full" />
      <ListSkeleton rows={6} />
    </div>
  );
}