import { auth } from "@/lib/auth/config";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge, PriorityBadge } from "@/components/requests/status-badge";
import { RequestEditForm } from "@/components/requests/request-edit-form";
import { getRequestById } from "@/lib/queries/requests";
import { REQUEST_TYPE_LABELS, formatDate } from "@/lib/utils";

export default async function RequestDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const { edit } = await searchParams;
  const requestId = parseInt(id);
  if (isNaN(requestId)) notFound();

  const request = await getRequestById(requestId);
  if (!request) notFound();

  const isAdmin = session.user.role === "admin";
  const isOwner = String(request.requestedById) === session.user.id;
  const canEdit = isAdmin || isOwner;
  const isEditMode = edit === "true" && canEdit;

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/requests" className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-muted-foreground">{request.requestCode}</span>
            <StatusBadge status={request.status} />
            <PriorityBadge priority={request.priority} />
          </div>
          <h1 className="text-xl font-bold text-foreground truncate mt-0.5">{request.title}</h1>
        </div>
        {canEdit && !isEditMode && (
          <Link href={`/requests/${id}?edit=true`} className={cn(buttonVariants({ variant: "outline" }))}>
            Edit
          </Link>
        )}
      </div>

      {isEditMode ? (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Edit Request</CardTitle>
          </CardHeader>
          <CardContent>
            <RequestEditForm
              requestId={requestId}
              defaultValues={{
                title: request.title,
                description: request.description,
                requestType: request.requestType,
                department: request.department,
                dateRequested: request.dateRequested,
                priority: request.priority,
                status: request.status,
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 space-y-5">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
              <p className="text-foreground whitespace-pre-wrap">{request.description}</p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Type</p>
                <p className="text-sm font-medium">{REQUEST_TYPE_LABELS[request.requestType]}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Department</p>
                <p className="text-sm font-medium">{request.department}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Requested By</p>
                <p className="text-sm font-medium">{request.requestedBy.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Date Requested</p>
                <p className="text-sm font-medium">{formatDate(request.dateRequested)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Created</p>
                <p className="text-sm font-medium">{formatDate(request.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Last Updated</p>
                <p className="text-sm font-medium">{formatDate(request.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
