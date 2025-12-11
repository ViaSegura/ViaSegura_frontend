"use server";

import { cookies } from "next/headers";
import { COOKIE_TOKEN } from "@viasegura/constants/cookies";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export async function getAuthenticatedFetch(url: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_TOKEN)?.value;

  const response = await fetch(`${baseURL}/${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = response.ok ? await response.json() : null;

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}
