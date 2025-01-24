"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, X } from 'lucide-react'
import { formatCurrency } from "@/lib/utils"
import { useCart } from "@/components/providers/cart-provider"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CartItemCard } from "@/components/cart/cart-item-card"

export function CartSheet() {
  const { items = [], isOpen, setIsOpen } = useCart() // Provide default empty array
  
  const itemCount = items?.reduce((total, item) => total + item.quantity, 0) ?? 0
  const subtotal = items?.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  ) ?? 0
  const shipping = subtotal > 1000 ? 0 : 100
  const total = subtotal + shipping

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Shopping Cart"
        >
          <ShoppingBag className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-1">
          <SheetTitle>Cart ({itemCount})</SheetTitle>
        </SheetHeader>
        {items.length > 0 ? (
          <>
            <ScrollArea className="flex-1 pr-6">
              <div className="space-y-4 pt-4">
                {items.map(item => (
                  <CartItemCard key={item.id} item={item} />
                ))}
              </div>
            </ScrollArea>
            <div className="pr-6">
              <Separator className="my-4" />
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-sm">Subtotal</span>
                  <span className="text-sm font-semibold">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Shipping</span>
                  <span className="text-sm font-semibold">
                    {shipping === 0 ? "Free" : formatCurrency(shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base font-semibold">Total</span>
                  <span className="text-base font-semibold">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
              <SheetFooter className="mt-4">
                <Button asChild className="w-full">
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-2">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            <span className="text-lg font-medium">Your cart is empty</span>
            <Button
              variant="link"
              className="text-sm text-muted-foreground"
              onClick={() => setIsOpen(false)}
            >
              Continue shopping
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

