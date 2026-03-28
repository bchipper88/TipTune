import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session || !session.user.artistProfileId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const artistProfileId = session.user.artistProfileId;

  // Total all-time earnings (COMPLETED tips only)
  const totalResult = await db.tip.aggregate({
    where: {
      status: "COMPLETED",
      request: { event: { artistProfileId } },
    },
    _sum: { amount: true },
  });

  // This month's earnings
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthResult = await db.tip.aggregate({
    where: {
      status: "COMPLETED",
      createdAt: { gte: monthStart },
      request: { event: { artistProfileId } },
    },
    _sum: { amount: true },
  });

  // Last completed event's earnings
  const lastEvent = await db.event.findFirst({
    where: { artistProfileId, status: "COMPLETED" },
    orderBy: { updatedAt: "desc" },
    select: { id: true, name: true },
  });

  let lastEventEarnings = 0;
  if (lastEvent) {
    const lastEventResult = await db.tip.aggregate({
      where: {
        status: "COMPLETED",
        request: { eventId: lastEvent.id },
      },
      _sum: { amount: true },
    });
    lastEventEarnings = lastEventResult._sum.amount || 0;
  }

  // Recent tips
  const recentTips = await db.tip.findMany({
    where: {
      status: "COMPLETED",
      request: { event: { artistProfileId } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      amount: true,
      message: true,
      createdAt: true,
      request: {
        select: {
          song: { select: { title: true } },
          event: { select: { name: true } },
        },
      },
    },
  });

  return NextResponse.json({
    totalEarnings: totalResult._sum.amount || 0,
    thisMonth: monthResult._sum.amount || 0,
    lastEventEarnings,
    lastEventName: lastEvent?.name || null,
    recentTips: recentTips.map((t) => ({
      id: t.id,
      amount: t.amount,
      message: t.message,
      createdAt: t.createdAt,
      songTitle: t.request.song.title,
      eventName: t.request.event.name,
    })),
  });
}
