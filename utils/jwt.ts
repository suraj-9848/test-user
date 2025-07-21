// Utility to decode JWT payload (no validation, just base64 decode)
export function decodeJwtPayload(token: string): any {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    let payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    // Pad base64 if needed
    while (payload.length % 4 !== 0) payload += "=";
    // Use atob in browser, Buffer in Node.js
    let decoded;
    if (typeof window !== "undefined" && typeof window.atob === "function") {
      decoded = window.atob(payload);
    } else if (typeof Buffer !== "undefined") {
      decoded = Buffer.from(payload, "base64").toString("utf-8");
    } else {
      return null;
    }
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}
