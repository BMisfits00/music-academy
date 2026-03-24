"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function selectInstrument(instrumentId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autenticado." };

  const instrument = await prisma.instrument.findUnique({ where: { id: instrumentId } });
  if (!instrument) return { error: "Instrumento no válido." };

  await prisma.user.update({
    where: { id: session.user.id },
    data: { instrumentId },
  });

  redirect(`/dashboard/${instrument.slug}`);
}
