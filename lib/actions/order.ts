"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const updateOrderSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
  tracking: z
    .object({
      number: z.string().optional(),
      courier: z.string().optional(),
      url: z.string().url().optional(),
    })
    .optional(),
  comment: z.string().optional(),
})

export async function getOrder(orderId: string) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        OR: [
          { userId: session.user.id },
          {
            artisanId: {
              in: (
                await prisma.artisan.findMany({
                  where: { userId: session.user.id },
                  select: { id: true },
                })
              ).map((a) => a.id),
            },
          },
        ],
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        artisan: true,
        user: true,
      },
    })

    if (!order) {
      throw new Error("Order not found")
    }

    return { success: true, order }
  } catch (error) {
    console.error("Failed to get order:", error)
    return { success: false, error: "Failed to get order" }
  }
}

export async function updateOrder(orderId: string, data: z.infer<typeof updateOrderSchema>) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    // First get the artisan's ID
    const artisan = await prisma.artisan.findFirst({
      where: {
        userId: session.user.id,
      },
    })

    if (!artisan) {
      throw new Error("Artisan not found")
    }

    // Verify the user is the artisan for this order
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        artisanId: artisan.id,
      },
    })

    if (!order) {
      throw new Error("Order not found")
    }

    const validatedFields = updateOrderSchema.parse(data)

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: validatedFields.status,
        tracking: validatedFields.tracking,
        timeline: {
          push: {
            status: validatedFields.status,
            timestamp: new Date().toISOString(),
            comment: validatedFields.comment,
          },
        },
      },
    })

    revalidatePath(`/orders/${orderId}`)
    return { success: true, order: updatedOrder }
  } catch (error) {
    console.error("Failed to update order:", error)
    return { success: false, error: "Failed to update order" }
  }
}

export async function getOrders(role?: "customer" | "artisan") {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    if (role === "artisan") {
      // First get the artisan's ID
      const artisan = await prisma.artisan.findFirst({
        where: {
          userId: session.user.id,
        },
      })

      if (!artisan) {
        throw new Error("Artisan not found")
      }

      // Then get orders for this artisan
      const orders = await prisma.order.findMany({
        where: {
          artisanId: artisan.id,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          artisan: true,
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      return { success: true, orders }
    }

    // Get customer orders
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        artisan: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return { success: true, orders }
  } catch (error) {
    console.error("Failed to get orders:", error)
    return { success: false, error: "Failed to get orders" }
  }
}

