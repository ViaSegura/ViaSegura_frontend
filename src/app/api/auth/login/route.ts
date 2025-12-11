import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  COOKIE_TOKEN,
  COOKIE_LOGIN,
  COOKIE_REFRESH_TOKEN,
} from "@viasegura/constants/cookies";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    
    const response = await fetch(`${baseURL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.status !== 200) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const data = await response.json();
    const { accessToken, refreshToken, username: user } = data;

    
    const cookieStore = await cookies();
    
    cookieStore.set(COOKIE_TOKEN, accessToken, {
      path: "/",
      maxAge: 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    cookieStore.set(COOKIE_REFRESH_TOKEN, refreshToken, {
      path: "/",
      maxAge: 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    cookieStore.set(COOKIE_LOGIN, user, {
      path: "/",
      maxAge: 60 * 60,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
