import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { Role } from "@/lib/permissions";
import UserTable from "@/components/admin/UserTable";
import CreateUserForm from "@/components/admin/CreateUserForm";

export default async function AdminPage() {
  const session = await auth();
  const callerRole = session!.user.role as Role;
  const callerId = session!.user.id as string;

  const [users, instruments, stats] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        instrument: { select: { id: true, name: true, slug: true } },
        _count: { select: { progress: true } },
      },
    }),
    prisma.instrument.findMany({ orderBy: { name: "asc" } }),
    prisma.$transaction([
      prisma.user.count(),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "TEACHER" } }),
      prisma.user.count({ where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } } }),
      prisma.progress.count({ where: { completed: true } }),
      prisma.progress.count(),
    ]),
  ]);

  const [totalUsers, totalStudents, totalTeachers, totalAdmins, completedModules, totalAttempts] = stats;

  const statCards = [
    { label: "Usuarios totales", value: totalUsers, color: "text-indigo-400" },
    { label: "Alumnos", value: totalStudents, color: "text-gray-200" },
    { label: "Profesores", value: totalTeachers, color: "text-indigo-300" },
    { label: "Admins", value: totalAdmins, color: "text-amber-300" },
    { label: "Módulos completados", value: completedModules, color: "text-emerald-400" },
    { label: "Total de intentos", value: totalAttempts, color: "text-gray-300" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Panel de Administración</h1>
          <p className="text-sm text-gray-400 mt-1">Gestión de usuarios y estadísticas del sistema.</p>
        </div>
        <CreateUserForm instruments={instruments} callerRole={callerRole} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabla de usuarios */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Usuarios</h2>
        <UserTable users={users} instruments={instruments} callerRole={callerRole} callerId={callerId} />
      </div>
    </div>
  );
}
