const defaultBackendURL = "http://localhost:8080";

export function getBackendBaseURL(): string {
  return process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || defaultBackendURL;
}

export function buildBackendURL(path: string): string {
  const baseURL = getBackendBaseURL().replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseURL}${normalizedPath}`;
}
