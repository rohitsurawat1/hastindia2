import Image from "next/image"
import Link from "next/link"
import type { CartItem } from "@/types/cart"
import { formatCurrency } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface CheckoutSummaryProps {
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
}

export function CheckoutSummary({
  items,
  subtotal,
  shipping,
  total,
}: CheckoutSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-4">
          {items.map((item) => (
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
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Shipping</span>
            <span className="font-medium">
              {shipping === 0 ? "Free" : formatCurrency(shipping)}
            </span>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span>Total</span>
          <span className="font-bold">{formatCurrency(total)}</span>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Shipping is free for orders above ₹1,000
      </CardFooter>
    </Card>
  )
}

