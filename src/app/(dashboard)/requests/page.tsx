import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { RequestTable } from "@/components/requests/request-table";
import { getRequests } from "@/lib/queries/requests";
import { requestFiltersSchema } from "@/lib/validations/request";
import { STATUS_LABELS, REQUEST_TYPE_LABELS, PRIORITY_LABELS, DEPARTMENTS } from "@/lib/utils";
import type { Status, RequestType, Priority } from "@/lib/db/schema";

interface SearchParams {
  search?: string;
  status?: string;
  requestType?: string;
  department?: string;
  priority?: string;
  page?: string;
}

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const params = await searchParams;
  const filters = requestFiltersSchema.parse(params);
  const isAdmin = session.user.role === "admin";

  const result = await getRequests(filters, session.user.id, isAdmin);

  const totalPages = result.totalPages;
  const currentPage = filters.page;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Requests</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {result.total} total request{result.total !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/requests/new" className={cn(buttonVariants())}>
          <Plus className="w-4 h-4 mr-1.5" />
          New Request
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <form className="flex flex-wrap gap-3">
            <Input
              name="search"
              defaultValue={params.search}
              placeholder="Search title, code, department..."
              className="w-full sm:w-64"
            />

            <Select name="status" defaultValue={params.status ?? "all"}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {(Object.entries(STATUS_LABELS) as [Status, string][]).map(([v, l]) => (
                  <SelectItem key={v} value={v}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select name="requestType" defaultValue={params.requestType ?? "all"}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {(Object.entries(REQUEST_TYPE_LABELS) as [RequestType, string][]).map(([v, l]) => (
                  <SelectItem key={v} value={v}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select name="department" defaultValue={params.department ?? "all"}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All departments</SelectItem>
                {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select name="priority" defaultValue={params.priority ?? "all"}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                {(Object.entries(PRIORITY_LABELS) as [Priority, string][]).map(([v, l]) => (
                  <SelectItem key={v} value={v}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button type="submit" variant="outline">Filter</Button>
          </form>
        </CardContent>
      </Card>

      {/* Table */}
      <RequestTable
        data={result.data}
        currentUserId={session.user.id}
        isAdmin={isAdmin}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            {currentPage > 1 && (
              <Link
                href={`/requests?${new URLSearchParams({ ...params, page: String(currentPage - 1) })}`}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                Previous
              </Link>
            )}
            {currentPage < totalPages && (
              <Link
                href={`/requests?${new URLSearchParams({ ...params, page: String(currentPage + 1) })}`}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
