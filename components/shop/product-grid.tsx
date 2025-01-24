"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useInView } from "react-intersection-observer"
import { Heart, Star } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { useSearchParams } from "next/navigation"
import { useCart } from "@/components/providers/cart-provider"

interface Product {
  id: string
  name: string
  artisan: {
    name: string
    region: string
  }
  price: number
  rating: number
  reviews: number
  image: string
}

// This would come from your database
const products: Product[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `product-${i}`,
  name: `Handcrafted Product ${i + 1}`,
  artisan: {
    name: "Artisan Name",
    region: "Rajasthan",
  },
  price: Math.floor(Math.random() * 5000) + 500,
  rating: 4.5,
  reviews: Math.floor(Math.random() * 500),
  image: `/placeholder.svg?height=300&width=300`,
}))

export function ProductGrid() {
  const searchParams = useSearchParams()
  const { ref, inView } = useInView()
  const [items, setItems] = React.useState(products.slice(0, 8))
  const view = searchParams.get("view") ?? "grid"
  const { addItem } = useCart()

  React.useEffect(() => {
    if (inView) {
      const moreItems = products.slice(items.length, items.length + 8)
      if (moreItems.length > 0) {
        setItems((prev) => [...prev, ...moreItems])
      }
    }
  }, [inView, items.length])

  return (
    <div
      className={cn("grid gap-4", {
        "grid-cols-1": view === "list",
        "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4": view === "grid",
      })}
    >
      {items.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <CardHeader className="border-b p-0">
            <Link
              href={`/product/${product.id}`}
              className="aspect-square relative block"
            >
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform hover:scale-105"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white/90"
              >
                <Heart className="h-4 w-4" />
                <span className="sr-only">Add to wishlist</span>
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="grid gap-2.5 p-4">
            <Link
              href={`/product/${product.id}`}
              className="line-clamp-2 font-semibold"
            >
              {product.name}
            </Link>
            <div className="text-sm text-muted-foreground">
              by{" "}
              <Link
                href={`/artisan/${product.artisan.name}`}
                className="hover:underline"
              >
                {product.artisan.name}
              </Link>{" "}
              from {product.artisan.region}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="text-sm font-semibold">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviews})
              </span>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <div className="flex w-full items-center justify-between">
              <div className="font-semibold">₹{product.price.toLocaleString()}</div>
              <Button
                size="sm"
                onClick={() => {
                  addItem({
                    id: product.id,
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    image: product.image,
                    artisan: product.artisan,
                  })
                }}
              >
                Add to Cart
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
      <div ref={ref} className="h-8" />
    </div>
  )
}

