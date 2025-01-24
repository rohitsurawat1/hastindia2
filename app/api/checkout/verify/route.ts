import crypto from "crypto"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderId 
    } = json

    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      return new NextResponse("Invalid signature", { status: 400 })
    }

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PROCESSING",
        paymentInfo: {
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Payment verification error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

