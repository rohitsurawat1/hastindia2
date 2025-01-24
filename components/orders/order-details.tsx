import Image from "next/image"
import Link from "next/link"
import type { Order } from "@/types/order"
import { formatCurrency } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface OrderDetailsProps {
  order: Order
}

export function OrderDetails({ order }: OrderDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Details</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <div className="text-sm font-medium">Order ID</div>
          <div className="font-mono text-sm">{order.id}</div>
        </div>
        <Separator />
        <div className="grid gap-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-start gap-4">
              <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded-lg border">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid flex-1 gap-1">
                <Link
                  href={`/product/${item.productId}`}
                  className="line-clamp-2 font-medium hover:underline"
                >
                  {item.name}
                </Link>
                {item.variant && (
                  <span className="text-sm text-muted-foreground">
                    {item.variant.name}
                  </span>
                )}
                <span className="text-sm">Qty: {item.quantity}</span>
              </div>
              <div className="font-medium">
                {formatCurrency(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>
        <Separator />
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <span className="text-sm">Subtotal</span>
            <span className="font-medium">
              {formatCurrency(order.total - (order.total > 1000 ? 0 : 100))}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Shipping</span>
            <span className="font-medium">
              {order.total > 1000 ? "Free" : formatCurrency(100)}
            </span>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span>Total</span>
          <span className="font-bold">{formatCurrency(order.total)}</span>
        </div>
      </CardContent>
      <CardFooter className="grid gap-4 text-sm">
        <div className="grid gap-2">
          <div className="font-medium">Shipping Address</div>
          <div className="text-muted-foreground">
            {order.shippingInfo.name}
            <br />
            {order.shippingInfo.address}
            <br />
            {order.shippingInfo.city}, {order.shippingInfo.state}{" "}
            {order.shippingInfo.pincode}
            <br />
            Phone: {order.shippingInfo.phone}
          </div>
        </div>
        {order.tracking && (
          <div className="grid gap-2">
            <div className="font-medium">Tracking Information</div>
            <div className="text-muted-foreground">
              {order.tracking.courier}
              <br />
              Tracking Number:{" "}
              {order.tracking.url ? (
                <Link
                  href={order.tracking.url}
                  className="font-mono hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {order.tracking.number}
                </Link>
              ) : (
                <span className="font-mono">{order.tracking.number}</span>
              )}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

