import type { Metadata } from "next"
import { getOrders } from "@/lib/actions/order"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { OrdersTable } from "@/components/orders/orders-table"
import { OrdersTableToolbar } from "@/components/orders/orders-table-toolbar"

export const metadata: Metadata = {
  title: "Orders | Dashboard",
  description: "Manage your orders",
}

export default async function DashboardOrdersPage() {
  const { orders } = await getOrders("artisan")

  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">Manage and track your orders</p>
        </div>
      </div>
      <div className="space-y-4">
        <OrdersTableToolbar />
        <OrdersTable orders={orders || []} isArtisan />
      </div>
    </DashboardShell>
  )
}

