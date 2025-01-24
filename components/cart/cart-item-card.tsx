"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, X } from 'lucide-react'
import type { CartItem } from "@/types/cart"
import { formatCurrency } from "@/lib/utils"
import { useCart } from "@/components/providers/cart-provider"
import { Button } from "@/components/ui/button"

interface CartItemCardProps {
  item: CartItem
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className="space-y-3">
      <div className="flex gap-4">
        <Link
          href={`/product/${item.productId}`}
          className="aspect-square h-24 relative rounded-lg border bg-muted"
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        </Link>
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link
                href={`/product/${item.productId}`}
                className="line-clamp-1 font-medium hover:underline"
              >
                {item.name}
              </Link>
              {item.variant && (
                <span className="text-sm text-muted-foreground">
                  {item.variant.name}
                </span>
              )}
              <div className="text-sm text-muted-foreground">
                by{" "}
                <Link
                  href={`/artisan/${item.artisan.id}`}
                  className="hover:underline"
                >
                  {item.artisan.name}
                </Link>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => removeItem(item.id)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove item</span>
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Minus className="h-3 w-3" />
                <span className="sr-only">Decrease quantity</span>
              </Button>
              <div className="flex h-8 w-12 items-center justify-center font-semibold">
                {item.quantity}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                disabled={item.quantity >= 99}
              >
                <Plus className="h-3 w-3" />
                <span className="sr-only">Increase quantity</span>
              </Button>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="font-semibold">
                {formatCurrency(item.price * item.quantity)}
              </span>
              {item.quantity > 1 && (
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(item.price)} each
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

