import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { can, type Role } from "@/lib/permissions";
import Sidebar from "@/components/layout/Sidebar";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!can(session.user.role as Role, "VIEW_TEACHER_PANEL")) redirect("/dashboard");

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar user={session.user} />
      <main className="flex-1 overflow-auto px-8 py-10 min-w-0">
        {children}
      </main>
    </div>
  );
}
