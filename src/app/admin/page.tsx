import { redirect } from "next/navigation";
import { getAdminSessionFromCookies } from "@/lib/auth";

export default async function AdminIndexPage() {
  const session = await getAdminSessionFromCookies();
  if (!session) redirect("/admin/login");
  redirect("/admin/dashboard");
}
