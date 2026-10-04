import { Skeleton, StatGridSkeleton, ListSkeleton } from "@/components/ui/Skeleton";

export default function PublicLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="mt-3 h-10 w-2/3 max-w-2xl" />
      <Skeleton className="mt-3 h-4 w-full max-w-xl" />
      <div className="mt-10">
        <StatGridSkeleton count={4} />
      </div>
      <div className="mt-10">
        <ListSkeleton rows={4} />
      </div>
    </div>
  );
}