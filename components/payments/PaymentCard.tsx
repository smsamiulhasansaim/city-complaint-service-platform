import Link from "next/link";
import { CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { PaymentStatusBadge } from "@/components/ui/StatusBadge";
import type { Payment } from "@/lib/api/types";
import { formatCurrency, formatRelative, humanizeEnum } from "@/lib/utils/format";

export interface PaymentCardProps {
  payment: Payment;
}

export function PaymentCard({ payment }: PaymentCardProps) {
  const title =
    payment.complaint?.title ??
    payment.serviceRequest?.id.slice(0, 8) ??
    humanizeEnum(payment.purpose);

  return (
    <Link href={`/dashboard/payments/${payment.id}`} className="block">
      <Card className="transition-all hover:border-ink hover:shadow-[4px_4px_0_0_var(--color-ink)]">
        <CardContent>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="flex items-center gap-2 text-base font-semibold text-ink">
              <CreditCard className="h-4 w-4 text-ink-muted" aria-hidden="true" />
              {title}
            </h3>
            <PaymentStatusBadge status={payment.status} />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-ink-muted">
            <span className="rounded-full border border-border-strong px-2 py-0.5 font-medium">
              {humanizeEnum(payment.purpose)}
            </span>
            <span>{humanizeEnum(payment.provider)}</span>
            <span className="ml-auto">
              {formatRelative(payment.createdAt)}
            </span>
          </div>

          <div className="mt-3 flex items-end justify-between">
            <span className="text-xs uppercase tracking-wider text-ink-muted">
              Amount
            </span>
            <span className="text-base font-semibold text-ink tabular-nums">
              {formatCurrency(payment.amount)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}