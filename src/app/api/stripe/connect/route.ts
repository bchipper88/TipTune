import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

// POST — Create Express account + onboarding link
export async function POST() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await db.artistProfile.findUnique({
    where: { userId: session.user.id },
    include: { user: { select: { email: true } } },
  });

  if (!profile) {
    return NextResponse.json(
      { error: "Artist profile not found" },
      { status: 404 }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  let stripeAccountId = profile.stripeAccountId;

  try {
    // Create a new Express account if one doesn't exist
    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email: profile.user.email,
        metadata: { artistProfileId: profile.id },
        capabilities: {
          transfers: { requested: true },
        },
      });

      stripeAccountId = account.id;

      await db.artistProfile.update({
        where: { id: profile.id },
        data: { stripeAccountId: account.id },
      });
    }

    // Create an account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${appUrl}/dashboard/earnings?stripe=refresh`,
      return_url: `${appUrl}/dashboard/earnings?stripe=success`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (err) {
    console.error("Stripe Connect error:", err);
    return NextResponse.json(
      { error: "Failed to set up Stripe account" },
      { status: 500 }
    );
  }
}
