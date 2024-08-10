import { NextRequest, NextResponse } from "next/server";
import { RegisterSchema } from "@/schemas/index";
import * as z from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body against the existing RegisterSchema
    const validated = RegisterSchema.safeParse(body);

    if (!validated.success) {
      // If validation fails, return a 400 error with the validation message
      const errors = validated.error.errors.map(err => err.message);
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    // Destructure validated data
    const { username, email, password } = validated.data;

    // Make a POST request to the Django API to create the user
    const response = await fetch('http://localhost:8000/api/account/signup/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    // Handle the response from the Django API
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || "Failed to create user" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(
      {
        message: "User created successfully",
        success: true,
        user: data.user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);

    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
