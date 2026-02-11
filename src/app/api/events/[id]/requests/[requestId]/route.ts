import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; requestId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: eventId, requestId } = await params;

  const event = await db.event.findUnique({
    where: { id: eventId },
    include: { artistProfile: { select: { userId: true } } },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  if (event.artistProfile.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { status } = body;

  if (!["PLAYING", "COMPLETED", "SKIPPED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await db.songRequest.update({
    where: { id: requestId },
    data: { status },
    include: {
      song: { select: { title: true, originalArtist: true, albumArtUrl: true } },
      _count: { select: { tips: true } },
    },
  });

  return NextResponse.json(updated);
}
