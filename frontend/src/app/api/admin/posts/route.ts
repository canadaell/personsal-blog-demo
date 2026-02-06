import { NextRequest, NextResponse } from "next/server";
import { readTokenFromCookies, validateCsrf } from "@/lib/server/auth";
import { buildBackendURL } from "@/lib/server/backend";

export async function GET(request: NextRequest) {
  const token = readTokenFromCookies(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendRes = await fetch(buildBackendURL("/admin/posts"), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await backendRes.json().catch(() => ({}));
  return NextResponse.json(data, { status: backendRes.status });
}

export async function POST(request: NextRequest) {
  const token = readTokenFromCookies(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!validateCsrf(request)) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }

  const body = await request.text();
  const backendRes = await fetch(buildBackendURL("/admin/posts"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body,
    cache: "no-store",
  });

  const data = await backendRes.json().catch(() => ({}));
  return NextResponse.json(data, { status: backendRes.status });
}
