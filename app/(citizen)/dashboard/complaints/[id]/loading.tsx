import { ListSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function ComplaintDetailLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-8 w-2/3" />
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <ListSkeleton rows={3} />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}