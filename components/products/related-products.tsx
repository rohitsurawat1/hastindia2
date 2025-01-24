"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, Star } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { useCart } from "@/components/providers/cart-provider"

// This would come from your database
const relatedProducts = Array.from({ length: 4 }).map((_, i) => ({
  id: `related-${i}`,
  name: `Related Product ${i + 1}`,
  artisan: {
    name: "Artisan Name",
    region: "Region",
  },
  price: Math.floor(Math.random() * 5000) + 500,
  rating: 4.5,
  reviews: Math.floor(Math.random() * 500),
  image: `/placeholder.svg`,
}))

export function RelatedProducts() {
  const { addItem } = useCart()
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Related Products</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {relatedProducts.map((product) => (
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
                <div className="font-semibold">
                  ₹{product.price.toLocaleString()}
                </div>
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
      </div>
    </div>
  )
}

