import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { supabaseId, name, email, role, stageName } = await req.json();

    if (!supabaseId || !email || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({ where: { id: supabaseId } });
    if (existingUser) {
      return NextResponse.json({ id: existingUser.id, email: existingUser.email });
    }

    const user = await db.user.create({
      data: {
        id: supabaseId,
        name,
        email,
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
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
