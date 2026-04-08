import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllUsers } from "@/lib/queries/users";
import { UserActions } from "@/components/admin/user-actions";
import { CreateUserDialog } from "@/components/admin/create-user-dialog";
import { formatDate } from "@/lib/utils";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "admin") redirect("/");

  const users = await getAllUsers();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{users.length} user{users.length !== 1 ? "s" : ""}</p>
        </div>
        <CreateUserDialog />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground text-sm">{user.name}</p>
                    <Badge
                      variant="secondary"
                      className={user.role === "admin" ? "bg-purple-500/20 text-purple-400 text-xs" : "bg-muted text-muted-foreground text-xs"}
                    >
                      {user.role}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {user.email} · {user.department ?? "No department"} · Joined {formatDate(user.createdAt)}
                  </p>
                </div>
                <UserActions
                  userId={user.id}
                  currentRole={user.role}
                  currentUserId={session.user.id}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
