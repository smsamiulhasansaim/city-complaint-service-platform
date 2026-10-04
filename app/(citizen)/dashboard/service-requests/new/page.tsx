"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Coins } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { StatCardSkeleton } from "@/components/ui/Skeleton";
import { useServices } from "@/hooks/useServices";
import { useCreateServiceRequest } from "@/hooks/useServiceRequests";
import { formatCurrency } from "@/lib/utils/format";
import {
  serviceRequestSchema,
  type ServiceRequestFormValues,
} from "@/lib/validations/serviceRequest.schema";

export default function NewServiceRequestPage() {
  const router = useRouter();
  const { data: services, isLoading, isError, refetch } = useServices();
  const createRequest = useCreateServiceRequest();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ServiceRequestFormValues>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: { serviceId: "", details: "" },
  });

  const selectedId = watch("serviceId");
  const selectedService = services?.find((s) => s.id === selectedId);

  const serviceOptions: SelectOption[] =
    services?.filter((s) => s.isActive).map((s) => ({
      value: s.id,
      label: `${s.name} — ${formatCurrency(s.fee)}`,
    })) ?? [];

  const onSubmit = handleSubmit(async (values) => {
    try {
      const created = await createRequest.mutateAsync({
        serviceId: values.serviceId,
        details: values.details || undefined,
      });
      toast.success("Request created — proceed to payment");
      router.replace(`/dashboard/service-requests/${created.id}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not create request";
      toast.error(message);
    }
  });

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/service-requests"
        className="inline-flex items-center gap-1 text-sm font-medium text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to service requests
      </Link>

      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          New service request
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Pick a service and describe your request. Payment is required before
          review.
        </p>
      </header>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : serviceOptions.length === 0 ? (
        <EmptyState
          icon={<Coins className="h-6 w-6" aria-hidden="true" />}
          title="No services available"
          description="The city has not published any services yet."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card>
            <CardContent className="pt-5">
              <form onSubmit={onSubmit} className="space-y-4" noValidate>
                <Select
                  label="Service"
                  required
                  placeholder="Select a service"
                  options={serviceOptions}
                  error={errors.serviceId?.message}
                  {...register("serviceId")}
                />

                <Textarea
                  label="Details (optional)"
                  rows={6}
                  placeholder="Anything the reviewing agent should know."
                  error={errors.details?.message}
                  {...register("details")}
                />

                <div className="flex justify-end gap-2 pt-2">
                  <Link href="/dashboard/service-requests">
                    <Button type="button" variant="ghost">
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    isLoading={isSubmitting || createRequest.isPending}
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Create request
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <aside className="space-y-4">
            <Card>
              <CardContent>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  Selected service
                </p>
                {selectedService ? (
                  <>
                    <h3 className="mt-2 text-base font-semibold text-ink">
                      {selectedService.name}
                    </h3>
                    <p className="mt-1 text-sm text-ink-muted">
                      {selectedService.description}
                    </p>
                    <div className="mt-4 rounded-md border border-border bg-surface-2/60 p-3">
                      <p className="text-xs uppercase tracking-wider text-ink-muted">
                        Fee
                      </p>
                      <p className="text-lg font-semibold text-ink">
                        {formatCurrency(selectedService.fee)}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-ink-muted">
                    Choose a service to see its fee.
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="rounded-lg border-2 border-border bg-surface-2/50 p-4 text-sm text-ink-muted">
              <p className="font-medium text-ink">What happens next?</p>
              <ol className="mt-2 list-decimal space-y-1 pl-5">
                <li>You&apos;ll be redirected to the payment page.</li>
                <li>After payment, the request enters agent review.</li>
                <li>You can track status on the request detail page.</li>
              </ol>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}