"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { can, type Role } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

async function getSessionUser() {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");
  return session.user;
}

export async function updateUserRole(userId: string, newRole: Role) {
  const caller = await getSessionUser();
  if (!can(caller.role as Role, "CHANGE_USER_ROLE")) {
    return { error: "No tenés permiso para cambiar roles." };
  }

  // No permitir cambiar el propio rol
  if (caller.id === userId) {
    return { error: "No podés cambiar tu propio rol." };
  }

  await prisma.user.update({ where: { id: userId }, data: { role: newRole } });
  revalidatePath("/admin");
  return { success: true };
}

export async function updateUser(
  userId: string,
  data: { name?: string; email?: string; instrumentId?: string | null }
) {
  const caller = await getSessionUser();
  if (!can(caller.role as Role, "EDIT_USER")) {
    return { error: "No tenés permiso para editar usuarios." };
  }
  if (caller.id === userId) {
    return { error: "Usá la configuración de perfil para editar tu propia cuenta." };
  }

  if (data.email) {
    const existing = await prisma.user.findFirst({
      where: { email: data.email, NOT: { id: userId } },
    });
    if (existing) return { error: "Ese email ya está en uso por otro usuario." };
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.name !== undefined && { name: data.name || null }),
      ...(data.email && { email: data.email }),
      ...(data.instrumentId !== undefined && { instrumentId: data.instrumentId }),
    },
  });

  revalidatePath("/admin");
  return { success: true };
}

export async function deleteUser(userId: string) {
  const caller = await getSessionUser();
  if (!can(caller.role as Role, "DELETE_USER")) {
    return { error: "No tenés permiso para eliminar usuarios." };
  }
  if (caller.id === userId) {
    return { error: "No podés eliminar tu propia cuenta." };
  }

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin");
  return { success: true };
}

export async function createUser(formData: FormData) {
  const caller = await getSessionUser();
  if (!can(caller.role as Role, "EDIT_USER")) {
    return { error: "No tenés permiso para crear usuarios." };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = (formData.get("role") as Role) || "STUDENT";
  const instrumentSlug = formData.get("instrument") as string | null;

  if (!email || !password) return { error: "Email y contraseña son obligatorios." };
  if (password.length < 6) return { error: "La contraseña debe tener al menos 6 caracteres." };

  // Solo SUPER_ADMIN puede crear ADMIN o SUPER_ADMIN
  if ((role === "ADMIN" || role === "SUPER_ADMIN") && !can(caller.role as Role, "CHANGE_USER_ROLE")) {
    return { error: "No tenés permiso para crear usuarios con ese rol." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "Ya existe un usuario con ese email." };

  const hashed = await bcrypt.hash(password, 10);

  let instrumentId: string | null = null;
  if (instrumentSlug) {
    const instrument = await prisma.instrument.findUnique({ where: { slug: instrumentSlug } });
    instrumentId = instrument?.id ?? null;
  }

  await prisma.user.create({
    data: { name: name || null, email, password: hashed, role, instrumentId },
  });

  revalidatePath("/admin");
  return { success: true };
}
