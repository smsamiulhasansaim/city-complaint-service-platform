"use client";

import Link from "next/link";
import Image from "next/image";
import { use } from "react";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Trash2,
  User as UserIcon,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { ListSkeleton, Skeleton } from "@/components/ui/Skeleton";
import { ComplaintStatusBadge } from "@/components/ui/StatusBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { Modal } from "@/components/ui/Modal";
import { ComplaintTimeline } from "@/components/complaints/ComplaintTimeline";
import { AddUpdateForm } from "@/components/complaints/AddUpdateForm";
import { ReviewForm } from "@/components/complaints/ReviewForm";
import { ExpediteButton } from "@/components/complaints/ExpediteButton";
import {
  useComplaint,
  useComplaintUpdates,
  useDeleteComplaint,
} from "@/hooks/useComplaints";
import { useAuth } from "@/hooks/useAuth";
import { formatDateTime, humanizeEnum, initials } from "@/lib/utils/format";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ComplaintDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const complaint = useComplaint(id);
  const updates = useComplaintUpdates(id);
  const deleteComplaint = useDeleteComplaint();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (complaint.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <ListSkeleton rows={3} />
      </div>
    );
  }

  if (complaint.isError || !complaint.data) {
    return (
      <ErrorState
        title="Complaint not found"
        message="We couldn't load this complaint. It may have been deleted or you don't have access."
        onRetry={() => void complaint.refetch()}
      />
    );
  }

  const c = complaint.data;
  const isOwner = user?.id === c.citizenId;
  const canEdit = isOwner && c.status === "PENDING";
  const canDelete = isOwner && c.status === "PENDING";
  const canReview =
    isOwner && (c.status === "RESOLVED" || c.status === "CLOSED");
  const canComment =
    isOwner || user?.role === "ADMIN" || user?.role === "AGENT";

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/complaints"
        className="inline-flex items-center gap-1 text-sm font-medium text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to complaints
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <ComplaintStatusBadge status={c.status} />
            <PriorityBadge priority={c.priority} />
            {c.isExpedited && (
              <span className="inline-flex items-center gap-1 rounded-full bg-danger-bg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-danger">
                <Zap className="h-3 w-3" aria-hidden="true" />
                Expedited
              </span>
            )}
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
            {c.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-ink-muted">
            {c.category && (
              <span className="rounded-full border border-border-strong px-2 py-0.5 font-medium">
                {c.category.name}
              </span>
            )}
            {c.ward && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" aria-hidden="true" />
                {c.ward}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" aria-hidden="true" />
              {formatDateTime(c.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isOwner &&
            !["RESOLVED", "CLOSED", "REJECTED"].includes(c.status) && (
              <ExpediteButton
                complaintId={c.id}
                isExpedited={c.isExpedited}
              />
            )}
          {canEdit && (
            <Link href={`/dashboard/complaints/${c.id}/edit`}>
              <Button variant="outline">Edit</Button>
            </Link>
          )}
          {canDelete && (
            <Button
              variant="danger"
              onClick={() => setConfirmOpen(true)}
              leftIcon={<Trash2 className="h-4 w-4" />}
            >
              Delete
            </Button>
          )}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">
                {c.description}
              </p>
              {c.address && (
                <p className="mt-4 text-xs text-ink-muted">
                  Address: {c.address}
                </p>
              )}
              {c.latitude !== null && c.longitude !== null && (
                <p className="mt-1 text-xs text-ink-muted">
                  Coordinates: {c.latitude}, {c.longitude}
                </p>
              )}
              {c.images.length > 0 && (
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {c.images.map((url) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="relative aspect-square overflow-hidden rounded-md border-2 border-border"
                    >
                      <Image
                        src={url}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 25vw, 50vw"
                        className="object-cover"
                        unoptimized
                      />
                    </a>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {updates.isLoading ? (
                <ListSkeleton rows={3} />
              ) : updates.isError ? (
                <ErrorState
                  title="Could not load timeline"
                  onRetry={() => void updates.refetch()}
                />
              ) : (
                <ComplaintTimeline updates={updates.data ?? []} />
              )}

              {canComment && (
                <div className="mt-6 border-t border-border pt-5">
                  <AddUpdateForm complaintId={c.id} />
                </div>
              )}
            </CardContent>
          </Card>

          {canReview && (
            <Card>
              <CardHeader>
                <CardTitle>Review</CardTitle>
              </CardHeader>
              <CardContent>
                <ReviewForm
                  complaintId={c.id}
                  existingReview={c.review ?? null}
                />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3 text-sm">
                <Row label="Filed by">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/25 text-[10px] font-semibold text-ink">
                      {c.citizen ? initials(c.citizen.name) : "?"}
                    </span>
                    <span className="font-medium text-ink">
                      {c.citizen?.name ?? "—"}
                    </span>
                  </div>
                </Row>
                <Row label="Assigned to">
                  {c.assignedAgent ? (
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/25 text-[10px] font-semibold text-ink">
                        {initials(c.assignedAgent.name)}
                      </span>
                      <span className="font-medium text-ink">
                        {c.assignedAgent.name}
                      </span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-ink-muted">
                      <UserIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      Unassigned
                    </span>
                  )}
                </Row>
                <Row label="Last updated">
                  {formatDateTime(c.updatedAt)}
                </Row>
                {c.resolvedAt && (
                  <Row label="Resolved at">
                    {formatDateTime(c.resolvedAt)}
                  </Row>
                )}
                <Row label="Priority">{humanizeEnum(c.priority)}</Row>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete this complaint?"
        description="This action cannot be undone."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              isLoading={deleteComplaint.isPending}
              onClick={() => {
                deleteComplaint.mutate(c.id, {
                  onSuccess: () => router.replace("/dashboard/complaints"),
                });
              }}
            >
              Delete complaint
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-muted">
          The complaint and its timeline will be permanently removed. You can
          only delete complaints that are still PENDING.
        </p>
      </Modal>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="text-right text-ink">{children}</dd>
    </div>
  );
}