import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminOrAgent } from "@/lib/auth";
import { createHunt, listHunts } from "@/lib/db";

export const runtime = "nodejs";

const createSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  packageType: z.enum(["upland", "echo", "clays", "custom"]),
  durationHours: z.number().positive(),
  maxGuests: z.number().int().positive(),
  pricePerGuest: z.number().nonnegative(),
  status: z.enum(["active", "cancelled"]).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const includeCancelled =
      req.nextUrl.searchParams.get("includeCancelled") === "true";
    if (includeCancelled) {
      const auth = await requireAdminOrAgent(req);
      if (!auth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
    const hunts = await listHunts({ includeCancelled });
    return NextResponse.json({ hunts });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to list hunts" },
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
    const hunt = await createHunt(body);
    return NextResponse.json({ hunt }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request";
    const status = error instanceof z.ZodError ? 400 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
