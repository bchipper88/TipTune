import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { createAdminClient } from "@/lib/supabase/admin";

// One-time seed endpoint to create a demo artist account. Dev-only — gated
// off in production so a public URL hit can't create accounts.
export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const email = "admin@playthatjam.com";
    const password = process.env.SEED_ADMIN_PASSWORD;
    if (!password) {
      return NextResponse.json(
        { error: "Set SEED_ADMIN_PASSWORD in .env.local to run the seed" },
        { status: 400 }
      );
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({
        message: `Demo account already exists for ${email}. Use the password from SEED_ADMIN_PASSWORD to log in.`,
      });
    }

    // Create user in Supabase Auth
    const supabase = createAdminClient();
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: "Failed to create Supabase auth user", details: authError?.message },
        { status: 500 }
      );
    }

    // Create Prisma user with Supabase auth UUID
    const user = await db.user.create({
      data: {
        id: authData.user.id,
        name: "Admin",
        email,
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

    // Create sample songs
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

      await db.event.create({
        data: {
          artistProfileId: user.artistProfile.id,
          name: "Friday Night Live",
          venueName: "The Blue Note",
          venueAddress: "123 Main St, Nashville, TN",
          startsAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
          status: "UPCOMING",
          eventSlug: "friday-night-live-" + Math.random().toString(36).substring(2, 8),
          description: "Live covers every Friday night. Request your favorites!",
        },
      });
    }

    return NextResponse.json({
      message: "Demo account created.",
      email,
      artistProfile: user.artistProfile?.profileSlug,
      note: "10 sample songs and an upcoming event created. Log in at /login with the password from SEED_ADMIN_PASSWORD, then connect Stripe and flip the event to LIVE.",
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seed failed", details: String(error) }, { status: 500 });
  }
}
