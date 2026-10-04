import { Skeleton, TableSkeleton } from "@/components/ui/Skeleton";

export default function AdminUsersLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-20 w-full" />
      <TableSkeleton rows={6} cols={5} />
    </div>
  );
}