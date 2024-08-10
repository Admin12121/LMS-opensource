import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/auth";
import { Default_Login_Redirect } from "@/routes";
import { LoginSchema } from "@/schemas/index";
import { AuthError } from "next-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { success, data, error } = LoginSchema.safeParse(body);

    if (!success) {
      const errors = error.errors.map((err) => err.message);
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    const { email, password } = data;

    try {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        return NextResponse.json(
          { error: error.type === "CredentialsSignin" ? "Invalid credentials!" : "Something went wrong!" },
          { status: 401 }
        );
      }
      throw error;
    }

    return NextResponse.json(
      { message: "Login Successful", success: true, redirectUrl: Default_Login_Redirect, },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
