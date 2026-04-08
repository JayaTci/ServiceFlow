import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
  date,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const roleEnum = pgEnum("role", ["admin", "user"]);
export const requestTypeEnum = pgEnum("request_type", [
  "it_support",
  "maintenance",
  "office",
  "document_processing",
  "general",
]);
export const priorityEnum = pgEnum("priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);
export const statusEnum = pgEnum("status", [
  "pending",
  "in_progress",
  "resolved",
  "closed",
  "cancelled",
]);

// Users table
export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    role: roleEnum("role").notNull().default("user"),
    department: varchar("department", { length: 100 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("users_email_idx").on(table.email)]
);

// Service Requests table
export const serviceRequests = pgTable("service_requests", {
  id: serial("id").primaryKey(),
  requestCode: varchar("request_code", { length: 20 }).notNull().unique(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  requestType: requestTypeEnum("request_type").notNull(),
  department: varchar("department", { length: 100 }).notNull(),
  requestedById: integer("requested_by_id")
    .references(() => users.id)
    .notNull(),
  dateRequested: date("date_requested").notNull(),
  priority: priorityEnum("priority").notNull().default("medium"),
  status: statusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  serviceRequests: many(serviceRequests),
}));

export const serviceRequestsRelations = relations(
  serviceRequests,
  ({ one }) => ({
    requestedBy: one(users, {
      fields: [serviceRequests.requestedById],
      references: [users.id],
    }),
  })
);

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type ServiceRequest = typeof serviceRequests.$inferSelect;
export type NewServiceRequest = typeof serviceRequests.$inferInsert;
export type Role = (typeof roleEnum.enumValues)[number];
export type RequestType = (typeof requestTypeEnum.enumValues)[number];
export type Priority = (typeof priorityEnum.enumValues)[number];
export type Status = (typeof statusEnum.enumValues)[number];
