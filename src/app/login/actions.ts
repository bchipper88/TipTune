"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function authenticate(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password" };
    }
    // Re-throw non-auth errors (including Next.js redirects)
    throw error;
  }
}
