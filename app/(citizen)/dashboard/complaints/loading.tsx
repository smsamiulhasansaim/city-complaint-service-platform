import { ListSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function ComplaintsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-32 w-full" />
      <ListSkeleton rows={5} />
    </div>
  );
}