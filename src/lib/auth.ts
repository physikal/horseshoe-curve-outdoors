import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const COOKIE_NAME = "hco_admin_session";

function secretKey() {
  const secret =
    process.env.ADMIN_SESSION_SECRET ||
    "hco-dev-secret-change-me-in-production";
  return new TextEncoder().encode(secret);
}

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "horseshoe",
  };
}

export function getAgentApiKey() {
  return process.env.AGENT_API_KEY || "hco-agent-dev-key";
}

export async function createAdminSessionToken(username: string) {
  return new SignJWT({ role: "admin", username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (payload.role !== "admin") return null;
    return payload as { role: string; username: string };
  } catch {
    return null;
  }
}

export async function setAdminSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function getAdminSessionFromCookies() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export function getBearerToken(req: NextRequest): string | null {
  const header = req.headers.get("authorization");
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

export async function requireAdminOrAgent(req: NextRequest) {
  const agentKey = getAgentApiKey();
  const bearer = getBearerToken(req);
  if (bearer && bearer === agentKey) {
    return { type: "agent" as const };
  }

  const cookieToken = req.cookies.get(COOKIE_NAME)?.value;
  if (cookieToken) {
    const session = await verifyAdminToken(cookieToken);
    if (session) return { type: "admin" as const, session };
  }

  return null;
}

export { COOKIE_NAME };
