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

  const [requestStats, tipStats] = await Promise.all([
    db.songRequest.groupBy({
      by: ["status"],
      where: { eventId: id },
      _count: true,
    }),
    db.tip.aggregate({
      where: { request: { eventId: id }, status: "COMPLETED" },
      _sum: { amount: true },
      _count: true,
    }),
  ]);

  const uniqueTippers = await db.tip.findMany({
    where: { request: { eventId: id }, status: "COMPLETED", userId: { not: null } },
    distinct: ["userId"],
    select: { userId: true },
  });

  const statusCounts: Record<string, number> = {};
  for (const row of requestStats) {
    statusCounts[row.status] = row._count;
  }

  const topSongs = await db.songRequest.findMany({
    where: { eventId: id },
    include: { song: { select: { title: true, originalArtist: true } } },
    orderBy: { totalTips: "desc" },
    take: 5,
  });

  return NextResponse.json({
    totalTips: tipStats._sum.amount ?? 0,
    tipCount: tipStats._count,
    uniqueTippers: uniqueTippers.length,
    songsPlayed: statusCounts["COMPLETED"] ?? 0,
    songsSkipped: statusCounts["SKIPPED"] ?? 0,
    songsQueued: statusCounts["QUEUED"] ?? 0,
    totalRequests: Object.values(statusCounts).reduce((a, b) => a + b, 0),
    topSongs: topSongs.map((r) => ({
      title: r.song.title,
      artist: r.song.originalArtist,
      tips: r.totalTips,
    })),
  });
}
