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
  let songTitle = "General Tip";

  if (targetSongId) {
    const song = await db.song.findUnique({ where: { id: targetSongId } });
    if (song) songTitle = song.title;
  } else {
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
    const { totalFee, chargeAmount } = calculateFees(tipAmount);
    const stripeAccountId = event.artistProfile.stripeAccountId;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const productName =
      songTitle === "General Tip"
        ? `Tip for ${event.artistProfile.stageName}`
        : `Tip for "${songTitle}"`;

    // Build Checkout Session params
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      ui_mode: "embedded",
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: productName },
            unit_amount: chargeAmount,
          },
          quantity: 1,
        },
      ],
      return_url: `${appUrl}/event/${event.eventSlug}/tip-success?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        eventId,
        songRequestId: songRequest.id,
        songId: targetSongId,
        tipAmount: String(tipAmount),
        message: message || "",
      },
    };

    if (stripeAccountId) {
      sessionParams.payment_intent_data = {
        application_fee_amount: totalFee,
        transfer_data: { destination: stripeAccountId },
      };
    }

    const session = await getStripe().checkout.sessions.create(sessionParams);

    // Create PENDING tip and optimistically increment totalTips
    const [tip] = await db.$transaction([
      db.tip.create({
        data: {
          requestId: songRequest.id,
          amount: tipAmount,
          message,
          status: "PENDING",
          stripePaymentIntentId: session.id,
        },
      }),
      db.songRequest.update({
        where: { id: songRequest.id },
        data: { totalTips: { increment: tipAmount } },
      }),
    ]);

    return NextResponse.json({
      clientSecret: session.client_secret,
      tipId: tip.id,
      requestId: songRequest.id,
    });
  } catch (err) {
    console.error("Stripe Checkout Session creation failed:", err);
    return NextResponse.json(
      { error: "Failed to create payment. Please try again." },
      { status: 500 }
    );
  }
}
