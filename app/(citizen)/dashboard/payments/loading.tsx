import { ListSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function PaymentsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-20 w-full" />
      <ListSkeleton rows={5} />
    </div>
  );
}