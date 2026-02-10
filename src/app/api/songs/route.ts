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
    return NextResponse.json({ error: "Artist profile not found" }, { status: 404 });
  }

  const songs = await db.song.findMany({
    where: { artistProfileId: profile.id },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(songs);
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
  const { title, originalArtist, albumArtUrl, genre, deezerTrackId, duration } = body;

  if (!title || !originalArtist) {
    return NextResponse.json({ error: "Title and artist are required" }, { status: 400 });
  }

  const maxOrder = await db.song.aggregate({
    where: { artistProfileId: profile.id },
    _max: { sortOrder: true },
  });

  const song = await db.song.create({
    data: {
      artistProfileId: profile.id,
      title,
      originalArtist,
      albumArtUrl,
      genre,
      deezerTrackId,
      duration,
      sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
    },
  });

  return NextResponse.json(song);
}
