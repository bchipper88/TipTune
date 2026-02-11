import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const events = await db.event.findMany({
    where: { status: { in: ["LIVE", "UPCOMING"] } },
    orderBy: [{ status: "asc" }, { startsAt: "asc" }],
    include: {
      artistProfile: {
        select: { stageName: true, profileSlug: true, genres: true },
      },
    },
  });

  return NextResponse.json(events);
}
