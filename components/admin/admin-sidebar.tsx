"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BarChart3, CalendarDays, Home, Users, Wallet } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "개요", icon: BarChart3 },
  { href: "/admin/users", label: "유저", icon: Users },
  { href: "/admin/teams", label: "팀", icon: Home },
  { href: "/admin/events", label: "이벤트", icon: CalendarDays },
  { href: "/admin/settlements", label: "정산", icon: Wallet },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-48 shrink-0">
      <nav className="flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
