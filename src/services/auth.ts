"use server";

import { cookies } from "next/headers";
import {
  COOKIE_TOKEN,
  COOKIE_LOGIN,
  COOKIE_REFRESH_TOKEN,
} from "@viasegura/constants/cookies";
import { SetCookiesLoginProps } from "@viasegura/types/auth";

interface LoginApiResponse {
  accessToken: string;
  refreshToken: string;
  username: string;
}

export const setCookieLogin = async ({ response }: SetCookiesLoginProps) => {
  const apiData: LoginApiResponse = await response.json();
  const { accessToken, refreshToken, username } = apiData;

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

  cookieStore.set(COOKIE_LOGIN, username, {
    path: "/",
    maxAge: 60 * 60,
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

export const clearToken = async () => {
  const cookieStore = await cookies();
  
  cookieStore.delete(COOKIE_TOKEN);
  cookieStore.delete(COOKIE_REFRESH_TOKEN);
  cookieStore.delete(COOKIE_LOGIN);
};
