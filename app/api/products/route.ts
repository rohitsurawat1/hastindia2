import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { Decimal } from "@prisma/client/runtime/library"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Helper function to transform Decimal to string
function transformProduct(product: any) {
  return {
    ...product,
    price: product.price.toString(),
    compareAtPrice: product.compareAtPrice?.toString() || null,
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
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

    // Check if SKU already exists
    const existingProduct = await prisma.product.findUnique({
      where: { sku: json.sku },
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: "A product with this SKU already exists. Please use a unique SKU." },
        { status: 400 },
      )
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name: json.name,
        description: json.description,
        story: json.story || null,
        category: json.category,
        price: new Decimal(json.price),
        compareAtPrice: json.compareAtPrice ? new Decimal(json.compareAtPrice) : null,
        sku: json.sku,
        stock: Number.parseInt(json.stock),
        images: json.images || [],
        featured: false,
        dimensions: json.dimensions || null,
        weight: json.weight || null,
        material: json.material || null,
        careInstructions: json.careInstructions || null,
        artisanId: artisan.id,
      },
    })

    // Transform the product before sending response
    return NextResponse.json(transformProduct(product))
  } catch (error) {
    console.error("Product creation error:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
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

    // Transform all products before sending response
    const transformedProducts = artisan.products.map(transformProduct)

    return NextResponse.json(transformedProducts)
  } catch (error) {
    console.error("Failed to get products:", error)
    return NextResponse.json({ error: "Failed to get products" }, { status: 500 })
  }
}

