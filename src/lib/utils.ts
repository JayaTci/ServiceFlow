import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Status, Priority, RequestType } from "@/lib/db/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRequestCode(year: number, count: number): string {
  return `SR-${year}-${String(count).padStart(4, "0")}`;
}

export const STATUS_LABELS: Record<Status, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
  cancelled: "Cancelled",
};

export const STATUS_COLORS: Record<Status, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  in_progress: "bg-blue-100 text-blue-800 border-blue-200",
  resolved: "bg-green-100 text-green-800 border-green-200",
  closed: "bg-gray-100 text-gray-800 border-gray-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: "bg-slate-100 text-slate-700 border-slate-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  high: "bg-orange-100 text-orange-700 border-orange-200",
  urgent: "bg-red-100 text-red-700 border-red-200",
};

export const REQUEST_TYPE_LABELS: Record<RequestType, string> = {
  it_support: "IT Support",
  maintenance: "Maintenance",
  office: "Office",
  document_processing: "Document Processing",
  general: "General",
};

export const DEPARTMENTS = [
  "IT",
  "HR",
  "Finance",
  "Operations",
  "Marketing",
  "Admin",
];

export function formatDate(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return "—";
  const d = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
