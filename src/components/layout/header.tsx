"use client";

import { Menu, LogOut, ChevronDown } from "lucide-react";
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
  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuToggle}
        className="lg:hidden"
      >
        <Menu className="w-5 h-5" />
      </Button>

      <div className="flex-1 lg:flex-none" />

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-2 h-9 rounded-lg hover:bg-gray-50 transition-colors outline-none">
            <Avatar className="w-7 h-7">
              <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-900 leading-none">{userName}</p>
            </div>
            {userRole && (
              <Badge
                variant="secondary"
                className={`hidden sm:inline-flex text-xs ${userRole === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}
              >
                {userRole}
              </Badge>
            )}
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <p className="font-medium">{userName}</p>
              <p className="text-xs text-gray-500 font-normal">{userEmail}</p>
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
