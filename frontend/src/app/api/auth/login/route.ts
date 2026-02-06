import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { buildBackendURL } from "@/lib/server/backend";

const tokenMaxAge = 7 * 24 * 60 * 60;

export async function POST(request: NextRequest) {
  let payload: { username?: string; password?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!payload.username || !payload.password) {
    return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
  }

  const backendRes = await fetch(buildBackendURL("/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await backendRes.json().catch(() => ({}));
  if (!backendRes.ok || !data?.token) {
    return NextResponse.json(
      { error: data?.error || "Login failed" },
      { status: backendRes.status || 401 }
    );
  }

  const csrfToken = randomUUID();
  const secure = process.env.NODE_ENV === "production";
  const response = NextResponse.json({ user: data.user }, { status: 200 });

  response.cookies.set("token", data.token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    maxAge: tokenMaxAge,
    path: "/",
  });

  response.cookies.set("csrf_token", csrfToken, {
    httpOnly: false,
    secure,
    sameSite: "lax",
    maxAge: tokenMaxAge,
    path: "/",
  });

  return response;
}
