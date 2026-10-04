import { Skeleton, TableSkeleton } from "@/components/ui/Skeleton";

export default function AdminServicesLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-56" />
      <TableSkeleton rows={6} cols={5} />
    </div>
  );
}