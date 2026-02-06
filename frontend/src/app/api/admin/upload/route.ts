import { NextRequest, NextResponse } from "next/server";
import { readTokenFromCookies, validateCsrf } from "@/lib/server/auth";
import { buildBackendURL } from "@/lib/server/backend";

export async function POST(request: NextRequest) {
  const token = readTokenFromCookies(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!validateCsrf(request)) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }

  const formData = await request.formData();
  const backendRes = await fetch(buildBackendURL("/admin/upload"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
    cache: "no-store",
  });

  const data = await backendRes.json().catch(() => ({}));
  return NextResponse.json(data, { status: backendRes.status });
}
