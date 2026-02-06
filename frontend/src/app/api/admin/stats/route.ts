import { NextRequest, NextResponse } from "next/server";
import { readTokenFromCookies } from "@/lib/server/auth";
import { buildBackendURL } from "@/lib/server/backend";

export async function GET(request: NextRequest) {
  const token = readTokenFromCookies(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendRes = await fetch(buildBackendURL("/admin/stats"), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await backendRes.json().catch(() => ({}));
  return NextResponse.json(data, { status: backendRes.status });
}
