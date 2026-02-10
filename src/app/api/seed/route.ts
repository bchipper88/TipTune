import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

// One-time seed endpoint to create an admin artist account
// Visit /api/seed to create the account, then delete this route in production
export async function GET() {
  try {
    const email = "admin@tiptune.com";

    // Check if already seeded
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({
        message: "Admin account already exists. Login with admin@tiptune.com / TipTune2026!",
      });
    }

    const passwordHash = await bcrypt.hash("TipTune2026!", 12);

    const user = await db.user.create({
      data: {
        name: "Admin",
        email,
        passwordHash,
        role: "ARTIST",
        artistProfile: {
          create: {
            stageName: "The House Band",
            bio: "Covering your favorite hits every weekend. From classic rock to modern pop — if you can sing along, we can play it.",
            genres: ["Rock", "Pop", "Country", "Classic Rock"],
            profileSlug: slugify("the-house-band") + "-" + Math.random().toString(36).substring(2, 8),
            socialLinks: {
              instagram: "https://instagram.com/thehouseband",
            },
          },
        },
      },
      include: { artistProfile: true },
    });

    // Create some sample songs in the library
    if (user.artistProfile) {
      await db.song.createMany({
        data: [
          { artistProfileId: user.artistProfile.id, title: "Don't Stop Believin'", originalArtist: "Journey", genre: "Rock", decade: "1980s", sortOrder: 1 },
          { artistProfileId: user.artistProfile.id, title: "Sweet Caroline", originalArtist: "Neil Diamond", genre: "Pop", decade: "1960s", sortOrder: 2 },
          { artistProfileId: user.artistProfile.id, title: "Piano Man", originalArtist: "Billy Joel", genre: "Rock", decade: "1970s", sortOrder: 3 },
          { artistProfileId: user.artistProfile.id, title: "Bohemian Rhapsody", originalArtist: "Queen", genre: "Rock", decade: "1970s", sortOrder: 4 },
          { artistProfileId: user.artistProfile.id, title: "Living on a Prayer", originalArtist: "Bon Jovi", genre: "Rock", decade: "1980s", sortOrder: 5 },
          { artistProfileId: user.artistProfile.id, title: "Mr. Brightside", originalArtist: "The Killers", genre: "Rock", decade: "2000s", sortOrder: 6 },
          { artistProfileId: user.artistProfile.id, title: "Sweet Home Alabama", originalArtist: "Lynyrd Skynyrd", genre: "Rock", decade: "1970s", sortOrder: 7 },
          { artistProfileId: user.artistProfile.id, title: "Wonderwall", originalArtist: "Oasis", genre: "Rock", decade: "1990s", sortOrder: 8 },
          { artistProfileId: user.artistProfile.id, title: "Take Me Home, Country Roads", originalArtist: "John Denver", genre: "Country", decade: "1970s", sortOrder: 9 },
          { artistProfileId: user.artistProfile.id, title: "Hotel California", originalArtist: "Eagles", genre: "Rock", decade: "1970s", sortOrder: 10 },
        ],
      });

      // Create a sample event
      await db.event.create({
        data: {
          artistProfileId: user.artistProfile.id,
          name: "Friday Night Live",
          venueName: "The Blue Note",
          venueAddress: "123 Main St, Nashville, TN",
          startsAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
          status: "LIVE",
          eventSlug: "friday-night-live-" + Math.random().toString(36).substring(2, 8),
          description: "Live covers every Friday night. Request your favorites!",
        },
      });
    }

    return NextResponse.json({
      message: "Admin account created!",
      login: {
        email: "admin@tiptune.com",
        password: "TipTune2026!",
      },
      artistProfile: user.artistProfile?.profileSlug,
      note: "10 sample songs and a live event have been created. Go to /login to sign in.",
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seed failed", details: String(error) }, { status: 500 });
  }
}
