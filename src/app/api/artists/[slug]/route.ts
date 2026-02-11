import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const profile = await db.artistProfile.findUnique({
    where: { profileSlug: slug },
    include: {
      _count: { select: { followers: true } },
    },
  });

  if (!profile) {
    return NextResponse.json({ error: "Artist not found" }, { status: 404 });
  }

  const [upcomingEvents, pastEvents, songs] = await Promise.all([
    db.event.findMany({
      where: {
        artistProfileId: profile.id,
        status: { in: ["UPCOMING", "LIVE"] },
      },
      orderBy: { startsAt: "asc" },
    }),
    db.event.findMany({
      where: {
        artistProfileId: profile.id,
        status: "COMPLETED",
      },
      orderBy: { startsAt: "desc" },
      take: 5,
    }),
    db.song.findMany({
      where: { artistProfileId: profile.id, isActive: true },
      orderBy: { sortOrder: "asc" },
      take: 20,
    }),
  ]);

  return NextResponse.json({
    profile: {
      stageName: profile.stageName,
      bio: profile.bio,
      genres: profile.genres,
      socialLinks: profile.socialLinks,
      avatarUrl: profile.avatarUrl,
      followerCount: profile._count.followers,
    },
    upcomingEvents,
    pastEvents,
    songs,
  });
}
