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
    include: { _count: { select: { followers: true } } },
  });

  if (!profile) {
    return NextResponse.json({ error: "Artist profile not found" }, { status: 404 });
  }

  return NextResponse.json(profile);
}

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

  const body = await req.json();
  const { stageName, bio, genres, socialLinks, avatarUrl, venmoUsername } = body;

  const cleanVenmo =
    typeof venmoUsername === "string"
      ? venmoUsername.trim().replace(/^@/, "") || null
      : venmoUsername;

  const updated = await db.artistProfile.update({
    where: { id: profile.id },
    data: {
      ...(stageName !== undefined && { stageName }),
      ...(bio !== undefined && { bio }),
      ...(genres !== undefined && { genres }),
      ...(socialLinks !== undefined && { socialLinks }),
      ...(avatarUrl !== undefined && { avatarUrl }),
      ...(venmoUsername !== undefined && { venmoUsername: cleanVenmo }),
    },
  });

  return NextResponse.json(updated);
}
