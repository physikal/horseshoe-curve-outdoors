import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSessionFromCookies } from "@/lib/auth";
import { AdminLogoutButton } from "@/components/admin-logout-button";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSessionFromCookies();
  if (!session) redirect("/admin/login");

  return (
    <div className="pt-24">
      <div className="border-b border-[var(--brand-forest)]/15 bg-[var(--brand-forest-deep)] text-[var(--brand-cream)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div>
            <p className="text-xs tracking-[0.18em] text-[var(--brand-gold)] uppercase">
              Admin
            </p>
            <p className="font-display text-xl">Schedule desk · {session.username}</p>
          </div>
          <nav className="flex flex-wrap items-center gap-4 text-sm">
            <Link href="/admin/dashboard" className="hover:text-[var(--brand-gold)]">
              Overview
            </Link>
            <Link href="/admin/hunts" className="hover:text-[var(--brand-gold)]">
              Hunts & slots
            </Link>
            <Link href="/admin/bookings" className="hover:text-[var(--brand-gold)]">
              Bookings
            </Link>
            <AdminLogoutButton />
          </nav>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">{children}</div>
    </div>
  );
}
