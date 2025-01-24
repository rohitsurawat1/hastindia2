import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const artisan = await prisma.artisan.findFirst({
      where: { userId: session.user.id },
    })

    if (!artisan) {
      return NextResponse.json(
        { error: "Artisan profile not found. Please create your profile first." },
        { status: 404 },
      )
    }

    const json = await request.json()

    const product = await prisma.product.create({
      data: {
        ...json,
        artisanId: artisan.id,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Product creation error:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const artisan = await prisma.artisan.findFirst({
      where: { userId: session.user.id },
      include: {
        products: {
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!artisan) {
      return NextResponse.json({ error: "Artisan profile not found" }, { status: 404 })
    }

    return NextResponse.json(artisan.products)
  } catch (error) {
    console.error("Failed to get products:", error)
    return NextResponse.json({ error: "Failed to get products" }, { status: 500 })
  }
}

