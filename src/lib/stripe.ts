import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const PLATFORM_FEE_PERCENT = 0.1; // 10%

export function calculateApplicationFee(amountInCents: number): number {
  return Math.round(amountInCents * PLATFORM_FEE_PERCENT);
}
