import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { razorpay, formatAmountForRazorpay } from "@/lib/razorpay"

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const { items, address } = json

    // Calculate order total
    const total = items.reduce(
      (acc: number, item: any) => acc + item.price * item.quantity,
      0
    )

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        artisanId: items[0].artisan.id, // Assuming single artisan order for now
        total,
        status: "PENDING",
        shippingInfo: address,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    })

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: formatAmountForRazorpay(total),
      currency: "INR",
      receipt: order.id,
    })

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    })
  } catch (error) {
    console.error("Checkout error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

