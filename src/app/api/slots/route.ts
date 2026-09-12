import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminOrAgent } from "@/lib/auth";
import { createSlot, listSlots } from "@/lib/db";

export const runtime = "nodejs";

const createSchema = z.object({
  huntId: z.string().min(1),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  capacity: z.number().int().positive(),
  notes: z.string().optional(),
  status: z.enum(["open", "full", "cancelled"]).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const huntId = req.nextUrl.searchParams.get("huntId") ?? undefined;
    const availableOnly =
      req.nextUrl.searchParams.get("availableOnly") === "true";
    const includeCancelled =
      req.nextUrl.searchParams.get("includeCancelled") === "true";
    if (includeCancelled) {
      const auth = await requireAdminOrAgent(req);
      if (!auth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
    const slots = await listSlots({ huntId, availableOnly, includeCancelled });
    return NextResponse.json({ slots });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to list slots" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminOrAgent(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = createSchema.parse(await req.json());
    if (new Date(body.endAt) <= new Date(body.startAt)) {
      return NextResponse.json(
        { error: "endAt must be after startAt" },
        { status: 400 },
      );
    }
    const slot = await createSlot(body);
    return NextResponse.json({ slot }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 },
    );
  }
}
