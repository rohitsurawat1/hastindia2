

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User } from "next-auth"
import { LayoutDashboard, ShoppingBag, Store, Settings, Palette, Package, Users, LineChart } from 'lucide-react'

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface DashboardNavProps {
  user: Pick<User, "role">
}

export function DashboardNav({ user }: DashboardNavProps) {
  const path = usePathname()

  const customerRoutes = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/orders",
      label: "Orders",
      icon: ShoppingBag,
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: Settings,
    },
  ]

  const artisanRoutes = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/products",
      label: "Products",
      icon: Package,
    },
    {
      href: "/dashboard/orders",
      label: "Orders",
      icon: ShoppingBag,
    },
    {
      href: "/dashboard/store",
      label: "Store",
      icon: Store,
    },
    {
      href: "/dashboard/customers",
      label: "Customers",
      icon: Users,
    },
    {
      href: "/dashboard/analytics",
      label: "Analytics",
      icon: LineChart,
    },
    {
      href: "/dashboard/customization",
      label: "Customization",
      icon: Palette,
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: Settings,
    },
  ]

  const routes = user.role === "ARTISAN" ? artisanRoutes : customerRoutes

  return (
    <nav className="grid items-start gap-2">
      {routes.map((route) => {
        const Icon = route.icon
        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              path === route.href
                ? "bg-muted hover:bg-muted"
                : "hover:bg-transparent hover:underline",
              "justify-start"
            )}
          >
            <Icon className="mr-2 h-4 w-4" />
            {route.label}
          </Link>
        )
      })}
    </nav>
  )
}