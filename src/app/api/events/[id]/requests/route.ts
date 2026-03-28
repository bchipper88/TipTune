import { NextResponse } from "next/server";

// Tip creation has moved to /api/stripe/create-payment-intent
// This route is no longer used for creating tips with payments.
export async function POST() {
  return NextResponse.json(
    { error: "Use /api/stripe/create-payment-intent for tips" },
    { status: 410 }
  );
}
