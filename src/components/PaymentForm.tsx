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
  onSuccess: () => void;
  onError: (message: string) => void;
}

export function PaymentForm({ tipAmount, onSuccess, onError }: PaymentFormProps) {
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

  const dollars = tipAmount / 100;
  const displayAmount =
    dollars % 1 === 0 ? `$${dollars}` : `$${dollars.toFixed(2)}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />

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
          `Pay ${displayAmount}`
        )}
      </Button>
    </form>
  );
}
