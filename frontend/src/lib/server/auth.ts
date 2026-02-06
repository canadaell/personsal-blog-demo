import { NextRequest } from "next/server";

const unsafeMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function readTokenFromCookies(request: NextRequest): string | null {
  return request.cookies.get("token")?.value ?? null;
}

export function validateCsrf(request: NextRequest): boolean {
  if (!unsafeMethods.has(request.method.toUpperCase())) {
    return true;
  }

  const csrfCookie = request.cookies.get("csrf_token")?.value;
  const csrfHeader = request.headers.get("x-csrf-token");
  return Boolean(csrfCookie && csrfHeader && csrfCookie === csrfHeader);
}
