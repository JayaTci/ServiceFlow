import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { StatusChart } from "@/components/dashboard/status-chart";
import { SimpleBarChart } from "@/components/dashboard/bar-chart";
import { Badge } from "@/components/ui/badge";
import {
  getDashboardStats,
  getCountByStatus,
  getCountByType,
  getCountByDepartment,
  getMonthlyTrend,
} from "@/lib/queries/reports";
import { getRequests } from "@/lib/queries/requests";
import {
  STATUS_LABELS,
  STATUS_COLORS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  formatDate,
} from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [stats, byStatus, byType, byDept, trend, recentRequests] =
    await Promise.all([
      getDashboardStats(),
      getCountByStatus(),
      getCountByType(),
      getCountByDepartment(),
      getMonthlyTrend(),
      getRequests({ pageSize: 5 }, session.user.id, session.user.role === "admin"),
    ]);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Welcome back, {session.user.name}
          </p>
        </div>
        <Link href="/requests/new" className={cn(buttonVariants())}>
          <Plus className="w-4 h-4 mr-1.5" />
          New Request
        </Link>
      </div>

      {/* Summary cards */}
      <SummaryCards stats={stats} />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">By Status</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusChart data={byStatus} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">By Request Type</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={byType} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">By Department</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={byDept} color="#8b5cf6" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Monthly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart
              data={trend.map((t) => ({ label: t.month, value: t.month, count: t.count }))}
              color="#10b981"
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Requests */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">Recent Requests</CardTitle>
          <Link href="/requests" className="text-blue-600 text-xs flex items-center hover:underline">
            View all <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {recentRequests.data.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No requests yet</p>
            ) : (
              recentRequests.data.map((req) => (
                <Link
                  key={req.id}
                  href={`/requests/${req.id}`}
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{req.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {req.requestCode} · {req.requestedBy.name} · {formatDate(req.dateRequested)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    <Badge className={`text-xs ${PRIORITY_COLORS[req.priority]}`} variant="outline">
                      {PRIORITY_LABELS[req.priority]}
                    </Badge>
                    <Badge className={`text-xs ${STATUS_COLORS[req.status]}`} variant="outline">
                      {STATUS_LABELS[req.status]}
                    </Badge>
                  </div>
                </Link>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
