"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PaymentFormProps {
  tipAmount: number;
  stripeFee: number;
  platformFee: number;
  totalFee: number;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export function PaymentForm({
  tipAmount,
  stripeFee,
  platformFee,
  totalFee,
  onSuccess,
  onError,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      const msg = error.message || "Payment failed. Please try again.";
      setErrorMessage(msg);
      onError(msg);
      setProcessing(false);
    } else {
      onSuccess();
    }
  };

  const totalCents = tipAmount + totalFee;
  const fmt = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />

      <div className="rounded-xl bg-card-bg p-3 text-sm">
        <div className="flex justify-between text-muted">
          <span>Tip</span>
          <span>{fmt(tipAmount)}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Processing fee</span>
          <span>{fmt(stripeFee)}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Service fee</span>
          <span>{fmt(platformFee)}</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-border pt-2 font-semibold text-text-white">
          <span>Total</span>
          <span>{fmt(totalCents)}</span>
        </div>
      </div>

      {errorMessage && (
        <p className="text-sm text-red-400">{errorMessage}</p>
      )}

      <Button
        type="submit"
        variant="warm"
        className="w-full gap-2 py-3 text-base font-semibold"
        disabled={!stripe || processing}
      >
        {processing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay ${fmt(totalCents)}`
        )}
      </Button>
    </form>
  );
}
