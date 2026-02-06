export function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const found = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));

  return found ? found.split("=")[1] : null;
}

export function getCsrfToken(): string | null {
  return getCookieValue("csrf_token");
}
