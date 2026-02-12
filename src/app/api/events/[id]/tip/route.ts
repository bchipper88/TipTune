import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: eventId } = await params;
  const body = await req.json();
  const { tipAmount, message } = body;

  if (!tipAmount || tipAmount < 100) {
    return NextResponse.json(
      { error: "Minimum tip of $1 required" },
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

  // Find or create the "General Tip" pseudo-song for this artist
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
        sortOrder: -1, // Hidden from library sort
        isActive: false, // Won't show in library
      },
    });
  }

  // Find or create the song request for this event
  let songRequest = await db.songRequest.findUnique({
    where: { eventId_songId: { eventId, songId: generalSong.id } },
  });

  if (!songRequest) {
    songRequest = await db.songRequest.create({
      data: { eventId, songId: generalSong.id, totalTips: 0 },
    });
  }

  // Create the tip and update the total
  const [tip] = await db.$transaction([
    db.tip.create({
      data: {
        requestId: songRequest.id,
        amount: tipAmount,
        message,
        status: "COMPLETED",
      },
    }),
    db.songRequest.update({
      where: { id: songRequest.id },
      data: { totalTips: { increment: tipAmount } },
    }),
  ]);

  return NextResponse.json({ tip, requestId: songRequest.id });
}
