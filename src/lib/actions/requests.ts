"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { serviceRequests } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { auth } from "@/lib/auth/config";
import { createRequestSchema, updateRequestSchema } from "@/lib/validations/request";
import { getRequestCountForYear } from "@/lib/queries/requests";
import { generateRequestCode } from "@/lib/utils";
import type { CreateRequestInput, UpdateRequestInput } from "@/lib/validations/request";

export async function createRequest(data: CreateRequestInput) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const parsed = createRequestSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const year = new Date().getFullYear();
  const count = await getRequestCountForYear(year);
  const requestCode = generateRequestCode(year, count + 1);

  await db.insert(serviceRequests).values({
    ...parsed.data,
    requestCode,
    requestedById: parseInt(session.user.id),
  });

  revalidatePath("/requests");
  revalidatePath("/");
  return { success: true, requestCode };
}

export async function updateRequest(id: number, data: UpdateRequestInput) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const parsed = updateRequestSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const [existing] = await db
    .select({ requestedById: serviceRequests.requestedById })
    .from(serviceRequests)
    .where(and(eq(serviceRequests.id, id), isNull(serviceRequests.deletedAt)))
    .limit(1);

  if (!existing) return { error: "Request not found" };

  const isAdmin = session.user.role === "admin";
  const isOwner = String(existing.requestedById) === session.user.id;
  if (!isAdmin && !isOwner) return { error: "Forbidden" };

  await db
    .update(serviceRequests)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(serviceRequests.id, id));

  revalidatePath("/requests");
  revalidatePath(`/requests/${id}`);
  revalidatePath("/");
  return { success: true };
}

export async function softDeleteRequest(id: number) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const [existing] = await db
    .select({ requestedById: serviceRequests.requestedById })
    .from(serviceRequests)
    .where(and(eq(serviceRequests.id, id), isNull(serviceRequests.deletedAt)))
    .limit(1);

  if (!existing) return { error: "Request not found" };

  const isAdmin = session.user.role === "admin";
  const isOwner = String(existing.requestedById) === session.user.id;
  if (!isAdmin && !isOwner) return { error: "Forbidden" };

  await db
    .update(serviceRequests)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(serviceRequests.id, id));

  revalidatePath("/requests");
  revalidatePath("/");
  return { success: true };
}
