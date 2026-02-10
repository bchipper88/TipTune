import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: eventId } = await params;
  const body = await req.json();
  const { songId, tipAmount, message } = body;

  if (!songId || !tipAmount || tipAmount < 100) {
    return NextResponse.json(
      { error: "Song and minimum tip of $1 required" },
      { status: 400 }
    );
  }

  const event = await db.event.findUnique({ where: { id: eventId } });
  if (!event || event.status !== "LIVE") {
    return NextResponse.json(
      { error: "Event is not currently live" },
      { status: 400 }
    );
  }

  // Find or create the song request for this event + song combo
  let songRequest = await db.songRequest.findUnique({
    where: { eventId_songId: { eventId, songId } },
  });

  if (!songRequest) {
    songRequest = await db.songRequest.create({
      data: { eventId, songId, totalTips: 0 },
    });
  }

  if (songRequest.status !== "QUEUED") {
    return NextResponse.json(
      { error: "This song is already playing or completed" },
      { status: 400 }
    );
  }

  // Create the tip and update the total
  const [tip] = await db.$transaction([
    db.tip.create({
      data: {
        requestId: songRequest.id,
        amount: tipAmount,
        message,
        status: "COMPLETED", // In production, this would be PENDING until Stripe confirms
      },
    }),
    db.songRequest.update({
      where: { id: songRequest.id },
      data: { totalTips: { increment: tipAmount } },
    }),
  ]);

  return NextResponse.json({ tip, requestId: songRequest.id });
}
