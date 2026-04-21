import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return _stripe;
}

export const PLATFORM_FEE_CENTS = 15; // $0.15 platform fee per transaction

export function calculateFees(tipAmountCents: number) {
  const stripeFee = Math.ceil(tipAmountCents * 0.029 + 30); // 2.9% + $0.30
  const platformFee = PLATFORM_FEE_CENTS;
  const totalFee = stripeFee + platformFee;
  const chargeAmount = tipAmountCents + totalFee;
  return { stripeFee, platformFee, totalFee, chargeAmount };
}

export type PayoutReadiness =
  | { ready: true }
  | { ready: false; reason: "not_connected" | "onboarding_incomplete" };

export async function isArtistReadyForPayouts(
  stripeAccountId: string | null | undefined
): Promise<PayoutReadiness> {
  if (!stripeAccountId) return { ready: false, reason: "not_connected" };
  try {
    const account = await getStripe().accounts.retrieve(stripeAccountId);
    if (account.charges_enabled && account.payouts_enabled) {
      return { ready: true };
    }
    return { ready: false, reason: "onboarding_incomplete" };
  } catch {
    return { ready: false, reason: "not_connected" };
  }
}
