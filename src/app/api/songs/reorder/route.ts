import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(req: Request) {
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

  const { songIds } = await req.json();

  if (!Array.isArray(songIds) || songIds.length === 0) {
    return NextResponse.json({ error: "songIds array required" }, { status: 400 });
  }

  // Update sort order for each song (only songs belonging to this artist)
  await db.$transaction(
    songIds.map((id: string, index: number) =>
      db.song.updateMany({
        where: { id, artistProfileId: profile.id },
        data: { sortOrder: index + 1 },
      })
    )
  );

  return NextResponse.json({ success: true });
}
