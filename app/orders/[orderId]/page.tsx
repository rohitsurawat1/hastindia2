import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getOrder } from "@/lib/actions/order"
import { OrderDetails } from "@/components/orders/order-details"
import { OrderTimeline } from "@/components/orders/order-timeline"
import { OrderActions } from "@/components/orders/order-actions"

interface OrderPageProps {
  params: {
    orderId: string
  }
}

export const metadata: Metadata = {
  title: "Order Details | HastIndia",
  description: "View your order details",
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { success, order } = await getOrder(params.orderId)

  if (!success || !order) {
    notFound()
  }

  return (
    <div className="container grid gap-8 pb-8 pt-6 md:grid-cols-2 md:py-8">
      <div className="space-y-8">
        <OrderDetails order={order} />
        <OrderTimeline order={order} />
      </div>
      <div>
        <OrderActions order={order} />
      </div>
    </div>
  )
}

