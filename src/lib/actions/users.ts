"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/config";
import type { Role } from "@/lib/db/schema";

export async function updateUserRole(userId: number, role: Role) {
  const session = await auth();
  if (session?.user?.role !== "admin") return { error: "Forbidden" };

  await db
    .update(users)
    .set({ role, updatedAt: new Date() })
    .where(eq(users.id, userId));

  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUser(userId: number) {
  const session = await auth();
  if (session?.user?.role !== "admin") return { error: "Forbidden" };
  if (String(userId) === session.user.id) return { error: "Cannot delete yourself" };

  await db.delete(users).where(eq(users.id, userId));
  revalidatePath("/admin/users");
  return { success: true };
}

export async function adminCreateUser(data: {
  name: string;
  email: string;
  password: string;
  role: Role;
  department?: string;
}) {
  const session = await auth();
  if (session?.user?.role !== "admin") return { error: "Forbidden" };

  const passwordHash = await bcrypt.hash(data.password, 10);
  await db.insert(users).values({
    name: data.name,
    email: data.email,
    passwordHash,
    role: data.role,
    department: data.department || null,
  });

  revalidatePath("/admin/users");
  return { success: true };
}
