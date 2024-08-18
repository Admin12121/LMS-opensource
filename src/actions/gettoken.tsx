"use server"

import { auth } from "@/auth";

export const getAccessToken = async (): Promise<string | null> => {
  const session = await auth(); // Must run on server-side only
  return session?.accessToken || null;
};
