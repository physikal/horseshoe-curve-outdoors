"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { images } from "@/lib/brand";
import { cn } from "@/lib/utils";

const filters = [
  { id: "all", label: "All" },
  { id: "hunts", label: "The Hunts" },
  { id: "land", label: "The Land" },
  { id: "lodging", label: "The Lodging" },
] as const;

export default function GalleryPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const photos = useMemo(
    () =>
      images.gallery.filter((p) =>
        filter === "all" ? true : p.category === filter,
      ),
    [filter],
  );

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="text-xs tracking-[0.22em] text-[var(--brand-moss)] uppercase">
          Photo Gallery
        </p>
        <h1 className="mt-3 font-display text-4xl text-[var(--brand-forest-deep)] md:text-5xl">
          The hunts, the land, the lodging
        </h1>
        <p className="mt-4 max-w-2xl text-[var(--brand-ink)]/75">
          A look at the cover, the country, and the lodges that make Horseshoe
          Curve Outdoors a place hunters come back to. Photos from
          horseshoecurveoutdoors.com.
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                "px-4 py-2 text-sm tracking-wide transition",
                filter === f.id
                  ? "bg-[var(--brand-forest)] text-[var(--brand-cream)]"
                  : "bg-[var(--brand-stone)]/60 text-[var(--brand-ink)] hover:bg-[var(--brand-stone)]",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-3 px-4 pb-20 sm:grid-cols-2 md:grid-cols-3 md:px-6">
        {photos.map((photo) => (
          <figure key={photo.src} className="group relative aspect-[4/3] overflow-hidden">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-sm text-white opacity-0 transition group-hover:opacity-100">
              {photo.alt}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
