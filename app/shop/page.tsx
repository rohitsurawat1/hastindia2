import { Suspense } from "react"
import { ProductFilters } from "@/components/shop/product-filters"
import { ProductGrid } from "@/components/shop/product-grid"
import { ProductsHeader } from "@/components/shop/products-header"
import { ProductGridSkeleton } from "@/components/shop/product-grid-skeleton"
import { Shell } from "@/components/shell"

export default function ShopPage() {
  return (
    <Shell>
      <ProductsHeader />
      <div className="flex flex-col gap-8 md:flex-row">
        <ProductFilters />
        <div className="flex-1">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid />
          </Suspense>
        </div>
      </div>
    </Shell>
  )
}

