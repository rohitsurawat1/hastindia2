import type { Metadata } from "next"
import { getOrders } from "@/lib/actions/order"
import { OrdersTable } from "@/components/orders/orders-table"
import { OrdersTableToolbar } from "@/components/orders/orders-table-toolbar"

export const metadata: Metadata = {
  title: "Orders | HastIndia",
  description: "View your order history",
}

export default async function OrdersPage() {
  const { orders } = await getOrders("customer")

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">View and track your orders</p>
        </div>
      </div>
      <div className="mt-8 space-y-4">
        <OrdersTableToolbar />
        <OrdersTable orders={orders || []} />
      </div>
    </div>
  )
}

