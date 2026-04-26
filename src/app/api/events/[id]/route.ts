import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { isArtistReadyForPayouts } from "@/lib/stripe";
import { broadcastToEvent } from "@/lib/realtime";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const event = await db.event.findUnique({
    where: { id },
    include: {
      artistProfile: { select: { stageName: true, profileSlug: true, userId: true } },
    },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json(event);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const event = await db.event.findUnique({
    where: { id },
    include: {
      artistProfile: { select: { userId: true, stripeAccountId: true } },
    },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  if (event.artistProfile.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { status, name, notes } = body;

  if (status && !["UPCOMING", "LIVE", "COMPLETED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  if (status === "LIVE" && event.status !== "LIVE") {
    const readiness = await isArtistReadyForPayouts(
      event.artistProfile.stripeAccountId
    );
    if (!readiness.ready) {
      return NextResponse.json(
        {
          error: "Connect Stripe before going live",
          reason: readiness.reason,
        },
        { status: 400 }
      );
    }
  }

  const data: Record<string, unknown> = {};
  if (status) data.status = status;
  if (typeof name === "string" && name.trim()) data.name = name.trim();
  if (typeof notes === "string") data.notes = notes;

  const updated = await db.event.update({
    where: { id },
    data,
  });

  if (status && status !== event.status) {
    await broadcastToEvent(id, "event_status", { status });
  }

  return NextResponse.json(updated);
}
