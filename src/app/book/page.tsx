import { Suspense } from "react";
import { listSlots } from "@/lib/db";
import { BookClient } from "@/components/book-client";
import type { SlotWithHunt } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ hunt?: string }>;
}) {
  const { hunt } = await searchParams;
  let slots: SlotWithHunt[] = [];
  let error: string | null = null;
  try {
    slots = await listSlots({
      huntId: hunt,
      availableOnly: true,
    });
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load slots";
  }

  return (
    <Suspense
      fallback={
        <div className="px-4 pt-32 text-[var(--brand-ink)]/70">
          Loading availability…
        </div>
      }
    >
      <BookClient
        initialSlots={slots}
        huntFilter={hunt ?? null}
        initialError={error}
      />
    </Suspense>
  );
}
