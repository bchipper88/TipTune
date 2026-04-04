import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await db.artistProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile || !profile.stripeAccountId) {
    return NextResponse.json({ connected: false });
  }

  try {
    const account = await getStripe().accounts.retrieve(profile.stripeAccountId);

    return NextResponse.json({
      connected: true,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      detailsSubmitted: account.details_submitted,
    });
  } catch (err) {
    console.error("Stripe account retrieve error:", err);
    return NextResponse.json({ connected: false });
  }
}
