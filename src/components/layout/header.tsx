"use client";

import { Menu, LogOut, ChevronDown, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logoutUser } from "@/lib/auth/actions";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  userName?: string;
  userEmail?: string;
  userRole?: string;
  onMenuToggle: () => void;
}

export function Header({ userName, userEmail, userRole, onMenuToggle }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuToggle}
        className="lg:hidden"
      >
        <Menu className="w-5 h-5" />
      </Button>

      <div className="flex-1 lg:flex-none" />

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-8 h-8"
        >
          <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-2 h-9 rounded-lg hover:bg-muted transition-colors outline-none">
            <Avatar className="w-7 h-7">
              <AvatarFallback className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium leading-none">{userName}</p>
            </div>
            {userRole && (
              <Badge
                variant="secondary"
                className={`hidden sm:inline-flex text-xs ${userRole === "admin" ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" : ""}`}
              >
                {userRole}
              </Badge>
            )}
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <p className="font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground font-normal">{userEmail}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logoutUser()}
              className="text-red-600 cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
