import { NextResponse } from "next/server";
import { searchDeezer } from "@/lib/deezer";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  try {
    const tracks = await searchDeezer(query);

    const results = tracks.map((track) => ({
      deezerTrackId: String(track.id),
      title: track.title,
      originalArtist: track.artist.name,
      albumArtUrl: track.album.cover_medium,
      duration: track.duration,
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error("Deezer search error:", error);
    return NextResponse.json({ error: "Failed to search songs" }, { status: 500 });
  }
}
