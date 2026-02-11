import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { name, role, stageName } = await req.json();

    // Verify the Supabase session server-side instead of trusting a client-provided ID
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({ where: { id: user.id } });
    if (existingUser) {
      return NextResponse.json({ id: existingUser.id, email: existingUser.email });
    }

    const dbUser = await db.user.create({
      data: {
        id: user.id,
        name,
        email: user.email!,
        role: role || "AUDIENCE",
        ...(role === "ARTIST" && stageName
          ? {
              artistProfile: {
                create: {
                  stageName,
                  profileSlug: slugify(stageName) + "-" + Math.random().toString(36).substring(2, 8),
                },
              },
            }
          : {}),
      },
      include: { artistProfile: true },
    });

    return NextResponse.json({
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
