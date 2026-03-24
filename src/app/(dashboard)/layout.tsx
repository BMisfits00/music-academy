import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import ProgressSidebar from "@/components/dashboard/ProgressSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar user={session.user} />
      <main className="flex-1 overflow-auto px-8 py-10 min-w-0">
        {children}
      </main>
      <ProgressSidebar userId={session.user.id} />
    </div>
  );
}
