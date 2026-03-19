import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const event = await db.event.findUnique({
    where: { id },
    include: { artistProfile: { select: { userId: true } } },
  });

  if (!event || event.artistProfile.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Get all song requests for this event
  const requests = await db.songRequest.findMany({
    where: { eventId: id },
    include: {
      song: { select: { title: true, originalArtist: true } },
      tips: { select: { amount: true, userId: true, status: true } },
    },
    orderBy: { totalTips: "desc" },
  });

  // Compute stats from the requests
  let totalTips = 0;
  let tipCount = 0;
  const statusCounts: Record<string, number> = {};

  for (const req of requests) {
    statusCounts[req.status] = (statusCounts[req.status] ?? 0) + 1;
    for (const tip of req.tips) {
      totalTips += tip.amount;
      tipCount++;
    }
  }

  const topSongs = requests.slice(0, 5).map((r) => ({
    title: r.song.title,
    artist: r.song.originalArtist,
    tips: r.totalTips,
  }));

  return NextResponse.json({
    totalTips,
    tipCount,
    songsPlayed: statusCounts["COMPLETED"] ?? 0,
    songsSkipped: statusCounts["SKIPPED"] ?? 0,
    songsQueued: statusCounts["QUEUED"] ?? 0,
    totalRequests: requests.length,
    topSongs,
  });
}
