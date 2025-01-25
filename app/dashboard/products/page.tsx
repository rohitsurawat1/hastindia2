import { getServerSession } from "next-auth"
import { Plus } from "lucide-react"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { ProductsTable } from "@/components/products/products-table"
import Link from "next/link"

// Helper function to serialize Decimal values
function serializeProduct(product: any) {
  return {
    ...product,
    price: product.price.toString(),
    compareAtPrice: product.compareAtPrice?.toString() || null,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  }
}

export default async function ProductsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return null
  }

  // Get artisan profile and their products
  const artisan = await prisma.artisan.findFirst({
    where: { userId: session.user.id },
    include: {
      products: {
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!artisan) {
    return (
      <div className="container py-8">
        <div className="rounded-lg border border-destructive/50 p-4">
          <h2 className="text-lg font-semibold">Artisan Profile Required</h2>
          <p className="mt-2 text-muted-foreground">
            You need to create an artisan profile before you can add products.
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/profile">Create Profile</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Serialize the products data
  const serializedProducts = artisan.products.map(serializeProduct)

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="mt-2 text-muted-foreground">Manage your products and inventory</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/products/create">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="mt-8">
        <ProductsTable products={serializedProducts} />
      </div>
    </div>
  )
}

