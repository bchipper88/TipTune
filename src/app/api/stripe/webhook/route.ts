import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const pi = event.data.object as Stripe.PaymentIntent;
      const tip = await db.tip.findFirst({
        where: { stripePaymentIntentId: pi.id },
      });

      if (tip && tip.status !== "COMPLETED") {
        await db.tip.update({
          where: { id: tip.id },
          data: { status: "COMPLETED" },
        });
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const pi = event.data.object as Stripe.PaymentIntent;
      const tip = await db.tip.findFirst({
        where: { stripePaymentIntentId: pi.id },
      });

      if (tip && tip.status === "PENDING") {
        await db.$transaction([
          db.tip.update({
            where: { id: tip.id },
            data: { status: "FAILED" },
          }),
          db.songRequest.update({
            where: { id: tip.requestId },
            data: { totalTips: { decrement: tip.amount } },
          }),
        ]);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
