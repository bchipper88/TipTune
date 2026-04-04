import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getStripe, calculateFees } from "@/lib/stripe";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.json();
  const { eventId, songId, tipAmount, message } = body;

  if (!eventId || !tipAmount || tipAmount < 100) {
    return NextResponse.json(
      { error: "Event ID and minimum tip of $1 required" },
      { status: 400 }
    );
  }

  if (tipAmount > 100000) {
    return NextResponse.json(
      { error: "Maximum tip is $1,000" },
      { status: 400 }
    );
  }

  const event = await db.event.findUnique({
    where: { id: eventId },
    include: { artistProfile: true },
  });

  if (!event || event.status !== "LIVE") {
    return NextResponse.json(
      { error: "Event is not currently live" },
      { status: 400 }
    );
  }

  // Determine the song — either a specific song or the "General Tip" pseudo-song
  let targetSongId = songId;

  if (!targetSongId) {
    let generalSong = await db.song.findFirst({
      where: {
        artistProfileId: event.artistProfileId,
        title: "General Tip",
        originalArtist: "—",
      },
    });

    if (!generalSong) {
      generalSong = await db.song.create({
        data: {
          artistProfileId: event.artistProfileId,
          title: "General Tip",
          originalArtist: "—",
          sortOrder: -1,
          isActive: false,
        },
      });
    }

    targetSongId = generalSong.id;
  }

  // Find or create the song request
  let songRequest = await db.songRequest.findUnique({
    where: { eventId_songId: { eventId, songId: targetSongId } },
  });

  if (!songRequest) {
    songRequest = await db.songRequest.create({
      data: { eventId, songId: targetSongId, totalTips: 0 },
    });
  }

  if (songRequest.status !== "QUEUED") {
    return NextResponse.json(
      { error: "This song is already playing or completed" },
      { status: 400 }
    );
  }

  try {
    const { stripeFee, platformFee, totalFee, chargeAmount } = calculateFees(tipAmount);
    const stripeAccountId = event.artistProfile.stripeAccountId;

    // Build PaymentIntent params — with or without destination
    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount: chargeAmount,
      currency: "usd",
      metadata: {
        eventId,
        songRequestId: songRequest.id,
        songId: targetSongId,
        ...(stripeAccountId ? {} : { needsTransfer: "true" }),
      },
    };

    if (stripeAccountId) {
      // Artist has Stripe connected — destination charge
      paymentIntentParams.application_fee_amount = totalFee;
      paymentIntentParams.transfer_data = { destination: stripeAccountId };
    }

    const paymentIntent = await getStripe().paymentIntents.create(paymentIntentParams);

    // Create PENDING tip and optimistically increment totalTips
    const [tip] = await db.$transaction([
      db.tip.create({
        data: {
          requestId: songRequest.id,
          amount: tipAmount,
          message,
          status: "PENDING",
          stripePaymentIntentId: paymentIntent.id,
        },
      }),
      db.songRequest.update({
        where: { id: songRequest.id },
        data: { totalTips: { increment: tipAmount } },
      }),
    ]);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      tipId: tip.id,
      requestId: songRequest.id,
      fees: { stripeFee, platformFee, totalFee },
    });
  } catch (err) {
    console.error("Stripe PaymentIntent creation failed:", err);
    return NextResponse.json(
      { error: "Failed to create payment. Please try again." },
      { status: 500 }
    );
  }
}
