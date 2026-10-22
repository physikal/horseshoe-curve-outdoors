import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminOrAgent } from "@/lib/auth";
import { cancelHunt, getHunt, updateHunt } from "@/lib/db";

export const runtime = "nodejs";

const patchSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  packageType: z.enum(["upland", "echo", "clays", "custom"]).optional(),
  durationHours: z.number().positive().optional(),
  maxGuests: z.number().int().positive().optional(),
  pricePerGuest: z.number().nonnegative().optional(),
  status: z.enum(["active", "cancelled"]).optional(),
});

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await ctx.params;
    const hunt = await getHunt(id);
    if (!hunt) {
      return NextResponse.json({ error: "Hunt not found" }, { status: 404 });
    }
    return NextResponse.json({ hunt });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get hunt" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminOrAgent(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await ctx.params;
    const body = patchSchema.parse(await req.json());
    const hunt =
      body.status === "cancelled" && Object.keys(body).length === 1
        ? await cancelHunt(id)
        : await updateHunt(id, body);
    if (!hunt) {
      return NextResponse.json({ error: "Hunt not found" }, { status: 404 });
    }
    return NextResponse.json({ hunt });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminOrAgent(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await ctx.params;
    const hunt = await cancelHunt(id);
    if (!hunt) {
      return NextResponse.json({ error: "Hunt not found" }, { status: 404 });
    }
    return NextResponse.json({ hunt });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to cancel hunt" },
      { status: 500 },
    );
  }
}
