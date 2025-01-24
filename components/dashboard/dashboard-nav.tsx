"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingBag, Store, Settings, BarChart } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const dashboardLinks = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingBag,
  },
  {
    title: "Store",
    href: "/dashboard/store",
    icon: Store,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start gap-2">
      {dashboardLinks.map((link) => {
        const Icon = link.icon
        return (
          <Button
            key={link.href}
            variant={pathname === link.href ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              pathname === link.href && "bg-muted font-medium"
            )}
            asChild
          >
            <Link href={link.href}>
              <Icon className="mr-2 h-4 w-4" />
              {link.title}
            </Link>
          </Button>
        )
      })}
    </nav>
  )
}

