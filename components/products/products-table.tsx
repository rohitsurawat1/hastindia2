"use client"

import Image from "next/image"
import Link from "next/link"
import { MoreHorizontal } from "lucide-react"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Product {
  id: string
  name: string
  description: string
  category: string
  price: string // Changed from Decimal to string
  compareAtPrice: string | null // Changed from Decimal to string
  sku: string
  stock: number
  images: string[]
  featured: boolean
  dimensions: string | null
  weight: string | null
  material: string | null
  careInstructions: string | null
  artisanId: string
  createdAt: string // Changed from Date to string
  updatedAt: string // Changed from Date to string
}

interface ProductsTableProps {
  products: Product[]
}

export function ProductsTable({ products }: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-lg font-semibold">No products yet</h3>
        <p className="mt-2 text-muted-foreground">Add your first product to start selling.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/products/create">Add Product</Link>
        </Button>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-lg border">
                  <Image
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-muted-foreground">SKU: {product.sku}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>₹{Number.parseFloat(product.price).toLocaleString("en-IN")}</TableCell>
            <TableCell>{product.stock}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/products/${product.id}`}>Edit Product</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Delete Product</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

