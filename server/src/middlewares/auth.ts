import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { verifyToken } from "../lib/jwt";

function getBearerToken(c: Context): string | undefined {
  const h = c.req.header("Authorization");
  return h?.startsWith("Bearer ") ? h.slice(7) : undefined;
}

function getCookieToken(c: Context, name: string): string | undefined {
  const raw = c.req.header("Cookie");
  if (!raw) return undefined;
  for (const part of raw.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return undefined;
}

export const authMiddleware = async (c: Context, next: Next) => {
  const token = getBearerToken(c) ?? getCookieToken(c, "session_token");

  if (!token) {
    c.set("user", null);
    return next();
  }

  const payload = await verifyToken(token, c.env.JWT_SECRET);
  c.set(
    "user",
    payload
      ? { id: payload.id, role: payload.role }
      : null,
  );

  return next();
};

export function requireAdmin(c: Context, next: Next) {
  const user = c.get("user");
  if (!user || user.role !== "admin") {
    throw new HTTPException(401, { message: "Unauthorized" });
  }
  return next();
}
