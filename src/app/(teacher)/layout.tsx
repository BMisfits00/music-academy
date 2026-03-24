import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { can, type Role } from "@/lib/permissions";
import Navbar from "@/components/layout/Navbar";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!can(session.user.role as Role, "VIEW_TEACHER_PANEL")) redirect("/dashboard");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={session.user} />
      <main className="flex-1 w-full px-6 py-8">
        {children}
      </main>
    </div>
  );
}
