import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"
import { CheckoutForm } from "@/components/checkout/checkout-form"

export const metadata: Metadata = {
  title: "Checkout | HastIndia",
  description: "Complete your purchase on HastIndia",
}

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login?callbackUrl=/checkout")
  }

  return (
    <div className="container grid gap-8 pb-8 pt-6 md:grid-cols-2 md:py-8">
      <CheckoutForm />
    </div>
  )
}

