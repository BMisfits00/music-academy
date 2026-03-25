import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { Role } from "@/lib/permissions";
import UserTable from "@/components/admin/UserTable";
import CreateUserForm from "@/components/admin/CreateUserForm";

export default async function UsuariosPage() {
  const session = await auth();
  const callerRole = session!.user.role as Role;
  const callerId = session!.user.id as string;

  const [users, instruments] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        instrument: { select: { id: true, name: true, slug: true } },
        _count: { select: { progress: true } },
      },
    }),
    prisma.instrument.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestión de usuarios</h1>
          <p className="text-sm text-gray-400 mt-1">
            Crear, editar y eliminar cuentas de la plataforma.
          </p>
        </div>
        <CreateUserForm instruments={instruments} callerRole={callerRole} />
      </div>

      <UserTable
        users={users}
        instruments={instruments}
        callerRole={callerRole}
        callerId={callerId}
      />
    </div>
  );
}
