import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createAdminSessionToken,
  getAdminCredentials,
  setAdminSessionCookie,
} from "@/lib/auth";

export const runtime = "nodejs";

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const creds = getAdminCredentials();
    if (body.username !== creds.username || body.password !== creds.password) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 },
      );
    }
    const token = await createAdminSessionToken(body.username);
    await setAdminSessionCookie(token);
    return NextResponse.json({ ok: true, username: body.username });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Login failed" },
      { status: 400 },
    );
  }
}
