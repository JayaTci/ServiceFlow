"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  Users,
  X,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/requests", label: "Requests", icon: ClipboardList },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/users", label: "User Management", icon: Users, adminOnly: true },
];

interface SidebarProps {
  role?: string;
  onClose?: () => void;
}

export function Sidebar({ role, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-background border-r border-border">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg">ServiceFlow</span>
        </Link>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems
          .filter((item) => !item.adminOnly || role === "admin")
          .map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-600/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-blue-500 dark:text-blue-400" : "text-muted-foreground")} />
                {item.label}
              </Link>
            );
          })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-border">
        <p className="text-xs text-muted-foreground px-3">
          {role === "admin" ? "Administrator" : "Staff"}
        </p>
      </div>
    </div>
  );
}
