import { createClient } from "@/lib/supabase/server";
import { db } from "./db";

// Get the authenticated user and their Prisma profile (for API routes & server components)
export async function auth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
    include: { artistProfile: { select: { id: true, profileSlug: true } } },
  });

  if (!dbUser) return null;

  return {
    user: {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
      artistProfileId: dbUser.artistProfile?.id,
      artistSlug: dbUser.artistProfile?.profileSlug,
    },
  };
}
