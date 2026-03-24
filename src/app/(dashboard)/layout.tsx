import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen">
      <Navbar user={session.user} />
      <main className="max-w-5xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  );
}
