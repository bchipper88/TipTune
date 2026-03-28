"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import type { ReactNode } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface StripeProviderProps {
  clientSecret: string;
  children: ReactNode;
}

export function StripeProvider({ clientSecret, children }: StripeProviderProps) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "night",
          variables: {
            colorPrimary: "#f59e0b",
            colorBackground: "#1a1a2e",
            colorText: "#e2e8f0",
            colorDanger: "#ef4444",
            borderRadius: "12px",
            fontFamily: "inherit",
          },
        },
      }}
    >
      {children}
    </Elements>
  );
}
