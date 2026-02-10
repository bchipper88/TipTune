import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateEventSlug } from "@/lib/utils";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await db.artistProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    return NextResponse.json({ error: "Artist profile not found" }, { status: 404 });
  }

  const events = await db.event.findMany({
    where: { artistProfileId: profile.id },
    orderBy: { startsAt: "desc" },
    include: {
      _count: { select: { requests: true } },
    },
  });

  return NextResponse.json(events);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await db.artistProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    return NextResponse.json({ error: "Artist profile not found" }, { status: 404 });
  }

  const body = await req.json();
  const { name, venueName, venueAddress, startsAt, endsAt, description } = body;

  if (!name || !venueName || !startsAt) {
    return NextResponse.json(
      { error: "Name, venue, and start time are required" },
      { status: 400 }
    );
  }

  const event = await db.event.create({
    data: {
      artistProfileId: profile.id,
      name,
      venueName,
      venueAddress,
      startsAt: new Date(startsAt),
      endsAt: endsAt ? new Date(endsAt) : null,
      description,
      eventSlug: generateEventSlug(name),
    },
  });

  return NextResponse.json(event);
}
