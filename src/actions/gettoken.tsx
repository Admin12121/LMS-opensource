"use server"

import { auth } from "@/auth";

export const getAccessToken = async (): Promise<string | null> => {
  const session = await auth(); // Must run on server-side only
  return session?.accessToken || null;
};

export const getUser = async () => {
  const session = await auth(); // Must run on server-side only
  console.log(session)
  return session?.user || null;
}