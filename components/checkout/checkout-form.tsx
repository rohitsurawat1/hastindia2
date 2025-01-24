"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from 'lucide-react'
import { toast } from "sonner"
import * as z from "zod"

import { useCart } from "@/components/providers/cart-provider"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CheckoutSummary } from "@/components/checkout/checkout-summary"

const addressSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter your full address"),
  city: z.string().min(2, "Please enter your city"),
  state: z.string().min(2, "Please enter your state"),
  pincode: z.string().min(6, "Please enter a valid pincode"),
})

type AddressValues = z.infer<typeof addressSchema>

declare global {
  interface Window {
    Razorpay: any
  }
}

export function CheckoutForm() {
  const router = useRouter()
  const { items, clearCart } = useCart()
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<AddressValues>({
    resolver: zodResolver(addressSchema),
  })

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
  const shipping = subtotal > 1000 ? 0 : 100
  const total = subtotal + shipping

  async function onSubmit(data: AddressValues) {
    if (items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    startTransition(async () => {
      try {
        // Create order
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items,
            address: data,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to create order")
        }

        const { orderId, razorpayOrderId, amount, currency } = await response.json()

        // Initialize Razorpay
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: amount,
          currency: currency,
          name: "HastIndia",
          description: "Payment for your order",
          order_id: razorpayOrderId,
          handler: async function (response: any) {
            try {
              const verifyResponse = await fetch("/api/checkout/verify", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  orderId,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              })

              if (!verifyResponse.ok) {
                throw new Error("Payment verification failed")
              }

              clearCart()
              toast.success("Order placed successfully")
              router.push(`/orders/${orderId}`)
            } catch (error) {
              console.error("Payment verification error:", error)
              toast.error("Payment verification failed")
            }
          },
          prefill: {
            name: data.name,
            email: data.email,
            contact: data.phone,
          },
        }

        const razorpay = new window.Razorpay(options)
        razorpay.open()
      } catch (error) {
        console.error("Checkout error:", error)
        toast.error("Something went wrong")
      }
    })
  }

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold">Checkout</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="Enter your phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your full address"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your state" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PIN Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter PIN code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Proceed to Payment
            </Button>
          </form>
        </Form>
      </div>
      <CheckoutSummary
        items={items}
        subtotal={subtotal}
        shipping={shipping}
        total={total}
      />
    </>
  )
}

