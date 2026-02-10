import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

// Debug endpoint to test auth — DELETE IN PRODUCTION
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ step: "findUser", error: "User not found", email });
    }

    if (!user.passwordHash) {
      return NextResponse.json({ step: "checkHash", error: "No passwordHash on user", userId: user.id });
    }

    const hashPreview = user.passwordHash.substring(0, 20) + "...";
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    return NextResponse.json({
      step: "bcryptCompare",
      userFound: true,
      userId: user.id,
      email: user.email,
      hasPasswordHash: true,
      hashPreview,
      hashLength: user.passwordHash.length,
      passwordMatch,
      bcryptjsVersion: "3.0.3",
    });
  } catch (error) {
    return NextResponse.json({ step: "error", error: String(error) }, { status: 500 });
  }
}
