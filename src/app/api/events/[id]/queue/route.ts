import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: eventId } = await params;

  const event = await db.event.findUnique({
    where: { id: eventId },
    include: {
      artistProfile: { select: { stageName: true, profileSlug: true } },
    },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const requests = await db.songRequest.findMany({
    where: { eventId, status: { in: ["QUEUED", "PLAYING"] } },
    include: {
      song: {
        select: { title: true, originalArtist: true, albumArtUrl: true },
      },
      _count: { select: { tips: true } },
    },
    orderBy: { totalTips: "desc" },
  });

  // Sum tips from ALL requests (including completed/skipped) for the event total
  const allTips = await db.songRequest.aggregate({
    where: { eventId },
    _sum: { totalTips: true },
    _count: true,
  });

  return NextResponse.json({
    event,
    requests,
    eventTotals: {
      totalTips: allTips._sum.totalTips ?? 0,
      requestCount: allTips._count,
    },
  });
}
