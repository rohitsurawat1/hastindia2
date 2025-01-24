"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { z } from "zod"

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  story: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  price: z.string().min(1, "Price is required"),
  compareAtPrice: z.string().optional(),
  sku: z.string().optional(),
  stock: z.string().min(1, "Stock is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  featured: z.boolean().default(false),
  dimensions: z.string().optional(),
  weight: z.string().optional(),
  material: z.string().optional(),
  careInstructions: z.string().optional(),
})

export async function createProduct(formData: z.infer<typeof productSchema>) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    // Get artisan profile
    const artisan = await prisma.artisan.findFirst({
      where: {
        userId: session.user.id,
      },
    })

    if (!artisan) {
      throw new Error("Artisan profile not found")
    }

    const validatedFields = productSchema.parse(formData)

    const product = await prisma.product.create({
      data: {
        name: validatedFields.name,
        description: validatedFields.description,
        story: validatedFields.story,
        category: validatedFields.category,
        price: Number.parseFloat(validatedFields.price),
        compareAtPrice: validatedFields.compareAtPrice ? Number.parseFloat(validatedFields.compareAtPrice) : null,
        sku: validatedFields.sku,
        stock: Number.parseInt(validatedFields.stock),
        images: validatedFields.images,
        featured: validatedFields.featured,
        dimensions: validatedFields.dimensions,
        weight: validatedFields.weight,
        material: validatedFields.material,
        careInstructions: validatedFields.careInstructions,
        artisanId: artisan.id,
      },
    })

    revalidatePath("/dashboard/products")
    return { success: true, product }
  } catch (error) {
    console.error("Failed to create product:", error)
    return { success: false, error: "Failed to create product" }
  }
}

export async function uploadProductImage(file: File) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    // For now, return a placeholder image URL
    // In production, this would upload to S3 or another storage service
    return {
      success: true,
      url: `/placeholder.svg?text=${encodeURIComponent(file.name)}&width=300&height=300`,
    }
  } catch (error) {
    console.error("Failed to upload image:", error)
    return { success: false, error: "Failed to upload image" }
  }
}

export async function getProducts() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    const artisan = await prisma.artisan.findFirst({
      where: {
        userId: session.user.id,
      },
    })

    if (!artisan) {
      throw new Error("Artisan profile not found")
    }

    const products = await prisma.product.findMany({
      where: {
        artisanId: artisan.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return { success: true, products }
  } catch (error) {
    console.error("Failed to get products:", error)
    return { success: false, error: "Failed to get products" }
  }
}

