"use server";

import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

// ─── Registro ──────────────────────────────────────────────────────────────
export type RegisterState = {
  error?: string;
  success?: boolean;
};

export async function registerUser(
  _prev: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const instrumentId = formData.get("instrumentId") as string | null;

  if (!name || !email || !password) {
    return { error: "Todos los campos son obligatorios." };
  }

  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  }

  if (password !== confirmPassword) {
    return { error: "Las contraseñas no coinciden." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Ya existe una cuenta con ese email." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "STUDENT",
      ...(instrumentId ? { instrumentId } : {}),
    },
  });

  // Login automático tras registro
  await signIn("credentials", { email, password, redirectTo: "/dashboard" });

  return { success: true };
}

// ─── Login ─────────────────────────────────────────────────────────────────
export type LoginState = {
  error?: string;
};

export async function loginUser(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Ingresá tu email y contraseña." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email o contraseña incorrectos." };
    }
    throw error; // NextAuth redirige con un throw, hay que re-lanzarlo
  }

  return {};
}
