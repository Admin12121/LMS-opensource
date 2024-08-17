import { auth } from "@/auth";

export const getAccessToken = async (): Promise<string | null> => {
  console.log("run")
    const session = await auth();
    console.log("session_token",session?.accessToken)
    return session?.accessToken || null;
};
