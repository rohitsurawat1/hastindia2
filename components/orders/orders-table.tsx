"use client"

import { useRouter } from "next/navigation"
import { format } from "date-fns"
import type { Order } from "@/types/order"
import { formatCurrency } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const statusMap = {
  PENDING: { label: "Pending", variant: "default" },
  PROCESSING: { label: "Processing", variant: "secondary" },
  SHIPPED: { label: "Shipped", variant: "primary" },
  DELIVERED: { label: "Delivered", variant: "success" },
  CANCELLED: { label: "Cancelled", variant: "destructive" },
} as const

interface OrdersTableProps {
  orders: Order[]
  isArtisan?: boolean
}

export function OrdersTable({ orders, isArtisan }: OrdersTableProps) {
  const router = useRouter()

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>{isArtisan ? "Customer" : "Artisan"}</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="cursor-pointer" onClick={() => router.push(`/orders/${order.id}`)}>
              <TableCell className="font-mono text-sm">{order.id}</TableCell>
              <TableCell>{isArtisan ? order.shippingInfo.name : order.artisan.shopName}</TableCell>
              <TableCell>{format(new Date(order.createdAt), "PPp")}</TableCell>
              <TableCell>
                <Badge variant={statusMap[order.status].variant as any}>{statusMap[order.status].label}</Badge>
              </TableCell>
              <TableCell className="font-medium">{formatCurrency(order.total)}</TableCell>
            </TableRow>
          ))}
          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No orders found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

