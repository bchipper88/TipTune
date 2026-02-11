import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const event = await db.event.findUnique({
    where: { eventSlug: slug },
    include: {
      artistProfile: {
        select: {
          stageName: true,
          profileSlug: true,
          userId: true,
        },
      },
    },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const requests = await db.songRequest.findMany({
    where: { eventId: event.id, status: { in: ["QUEUED", "PLAYING"] } },
    include: {
      song: {
        select: { id: true, title: true, originalArtist: true, albumArtUrl: true },
      },
      _count: { select: { tips: true } },
    },
    orderBy: { totalTips: "desc" },
  });

  const library = await db.song.findMany({
    where: { artistProfileId: event.artistProfileId, isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({ event, requests, library });
}
