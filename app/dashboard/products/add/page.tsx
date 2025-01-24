import { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ProductForm } from "@/components/dashboard/products/product-form"
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs"

export const metadata: Metadata = {
  title: "Add Product | Dashboard",
  description: "Add a new product to your store",
}

export default function AddProductPage() {
  return (
    <DashboardShell>
      <Breadcrumbs
        segments={[
          {
            title: "Products",
            href: "/dashboard/products",
          },
          {
            title: "Add Product",
            href: "/dashboard/products/add",
          },
        ]}
      />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Add Product</h2>
          <p className="text-muted-foreground">
            Create a new product listing for your store
          </p>
        </div>
      </div>
      <ProductForm />
    </DashboardShell>
  )
}

