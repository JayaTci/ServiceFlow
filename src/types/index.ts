import type { ServiceRequest, User } from "@/lib/db/schema";

export type ServiceRequestWithUser = ServiceRequest & {
  requestedBy: Pick<User, "id" | "name" | "email" | "department">;
};

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type DashboardStats = {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
};

export type CountByField = {
  label: string;
  value: string;
  count: number;
};

// Extend next-auth session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      department: string | null;
    };
  }
}
