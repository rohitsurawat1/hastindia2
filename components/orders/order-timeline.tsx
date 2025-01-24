import { format } from "date-fns"
import type { Order } from "@/types/order"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const statusConfig = {
  PENDING: {
    label: "Order Placed",
    description: "Your order has been placed successfully",
  },
  PROCESSING: {
    label: "Processing",
    description: "Your order is being processed",
  },
  SHIPPED: {
    label: "Shipped",
    description: "Your order has been shipped",
  },
  DELIVERED: {
    label: "Delivered",
    description: "Your order has been delivered",
  },
  CANCELLED: {
    label: "Cancelled",
    description: "Your order has been cancelled",
  },
}

interface OrderTimelineProps {
  order: Order
}

export function OrderTimeline({ order }: OrderTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4 before:absolute before:left-[11px] before:h-full before:w-0.5 before:bg-muted">
          {order.timeline.map((event, index) => (
            <div key={index} className="flex gap-4">
              <div className="relative flex h-6 w-6 shrink-0 items-center justify-center">
                <div className="absolute h-2 w-2 rounded-full bg-primary" />
              </div>
              <div className="grid gap-1">
                <div className="text-sm font-medium">
                  {statusConfig[event.status].label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {event.comment || statusConfig[event.status].description}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(event.timestamp), "PPp")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

