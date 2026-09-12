"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AdminLogoutButton() {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      className="border-[var(--brand-cream)]/30 bg-transparent text-[var(--brand-cream)] hover:bg-white/10"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
    >
      Sign out
    </Button>
  );
}
