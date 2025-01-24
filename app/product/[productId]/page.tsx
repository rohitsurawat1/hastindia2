import { Suspense } from "react"
import { notFound } from "next/navigation"
import { ProductGallery } from "@/components/products/product-gallery"
import { ProductInfo } from "@/components/products/product-info"
import { ProductTabs } from "@/components/products/product-tabs"
import { RelatedProducts } from "@/components/products/related-products"
import { Shell } from "@/components/shell"
import { Skeleton } from "@/components/ui/skeleton"

// This would come from your database
async function getProduct(productId: string) {
  const product = {
    id: productId,
    name: "Handwoven Pashmina Shawl",
    description: "Intricately handwoven Pashmina shawl made from the finest Kashmir wool.",
    price: 15000,
    compareAtPrice: 18000,
    rating: 4.8,
    reviews: 124,
    stock: 15,
    artisan: {
      id: "artisan-1",
      name: "Rehman Khan",
      region: "Kashmir Valley",
      rating: 4.9,
      products: 45,
      sales: 1200,
      joinedDate: "2022-01-15",
      image: "/placeholder.svg",
      story: "A third-generation Pashmina weaver from Srinagar...",
    },
    images: Array(5).fill("/placeholder.svg"),
    specifications: {
      material: "100% Pashmina Wool",
      dimensions: "200cm x 75cm",
      weight: "200g",
      careInstructions: [
        "Dry clean only",
        "Store folded in a cool, dry place",
        "Avoid direct sunlight",
      ],
    },
    story: "This Pashmina shawl represents centuries of Kashmiri craftsmanship...",
    process: "Each shawl takes approximately 180 hours to complete...",
    variants: [
      { id: "1", name: "Natural White", inStock: true },
      { id: "2", name: "Midnight Blue", inStock: true },
      { id: "3", name: "Royal Red", inStock: false },
    ],
  }

  return product
}

interface ProductPageProps {
  params: {
    productId: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.productId)

  if (!product) {
    notFound()
  }

  return (
    <Shell>
      <div className="flex flex-col gap-8 md:gap-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          <Suspense fallback={<Skeleton className="aspect-square w-full" />}>
            <ProductGallery images={product.images} />
          </Suspense>
          <ProductInfo product={product} />
        </div>
        <ProductTabs product={product} />
        <RelatedProducts />
      </div>
    </Shell>
  )
}

