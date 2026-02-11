import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await db.artistProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    return NextResponse.json({
      totalSongs: 0,
      totalEvents: 0,
      totalEarnings: 0,
      activeEvent: null,
    });
  }

  const [totalSongs, totalEvents, activeEvent, earnings] = await Promise.all([
    db.song.count({ where: { artistProfileId: profile.id } }),
    db.event.count({ where: { artistProfileId: profile.id } }),
    db.event.findFirst({
      where: { artistProfileId: profile.id, status: "LIVE" },
      select: { id: true, name: true },
    }),
    db.tip.aggregate({
      where: {
        request: { event: { artistProfileId: profile.id } },
        status: "COMPLETED",
      },
      _sum: { amount: true },
    }),
  ]);

  return NextResponse.json({
    totalSongs,
    totalEvents,
    totalEarnings: earnings._sum.amount ?? 0,
    activeEvent,
  });
}
