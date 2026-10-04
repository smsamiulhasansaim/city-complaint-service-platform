"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useApiAuth } from "@/hooks/useApiAuth";
import type { CheckoutSession } from "@/lib/api/types";
import { formatCurrency } from "@/lib/utils/format";

export interface ExpediteButtonProps {
  complaintId: string;
  isExpedited: boolean;
  disabled?: boolean;
  expediteFee?: number;
}

const DEFAULT_FEE = 20;

export function ExpediteButton({
  complaintId,
  isExpedited,
  disabled = false,
  expediteFee = DEFAULT_FEE,
}: ExpediteButtonProps) {
  const { call } = useApiAuth();
  const [open, setOpen] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const startCheckout = async () => {
    setIsStarting(true);
    try {
      const result = await call<CheckoutSession>(
        `/payments/complaints/${complaintId}/expedite`,
        { method: "POST" },
      );
      if (!result.checkoutUrl) {
        throw new Error("No checkout URL returned");
      }
      window.location.href = result.checkoutUrl;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not start checkout";
      toast.error(message);
      setIsStarting(false);
      setOpen(false);
    }
  };

  if (isExpedited) {
    return (
      <Button variant="outline" disabled leftIcon={<Zap className="h-4 w-4" />}>
        Already expedited
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="accent"
        disabled={disabled}
        onClick={() => setOpen(true)}
        leftIcon={<Zap className="h-4 w-4" />}
      >
        Expedite
      </Button>

      <Modal
        open={open}
        onClose={() => !isStarting && setOpen(false)}
        title="Expedite this complaint"
        description="Your complaint will be marked URGENT and prioritized in the agent queue."
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isStarting}
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              isLoading={isStarting}
              onClick={() => void startCheckout()}
              leftIcon={<Zap className="h-4 w-4" />}
            >
              Pay {formatCurrency(expediteFee)}
            </Button>
          </>
        }
      >
        <ul className="list-disc space-y-2 pl-5 text-sm text-ink-muted">
          <li>Marks the complaint as URGENT.</li>
          <li>Raises the priority in the assignment queue.</li>
          <li>One-time fee of {formatCurrency(expediteFee)}.</li>
          <li>You will be redirected to Stripe Checkout.</li>
        </ul>
      </Modal>
    </>
  );
}