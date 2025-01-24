"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, Minus, Plus, Share2, Star } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/providers/cart-provider"

interface ProductInfoProps {
  product: any // Type this properly based on your product type
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = React.useState(1)
  const { addItem } = useCart()

  return (
    <div className="flex w-full flex-col lg:max-w-[400px]">
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-bold">{product.name}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-0.5">
            <Star className="h-5 w-5 fill-primary text-primary" />
            <span className="font-semibold">{product.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {product.reviews} reviews
          </span>
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm text-muted-foreground">
            {product.stock} in stock
          </span>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-2xl font-bold">
              ₹{product.price.toLocaleString()}
            </div>
            {product.compareAtPrice && (
              <div className="text-sm text-muted-foreground line-through">
                ₹{product.compareAtPrice.toLocaleString()}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Heart className="h-4 w-4" />
              <span className="sr-only">Add to wishlist</span>
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share product</span>
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <div className="font-semibold">Variant</div>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select variant" />
            </SelectTrigger>
            <SelectContent>
              {product.variants.map((variant: any) => (
                <SelectItem
                  key={variant.id}
                  value={variant.id}
                  disabled={!variant.inStock}
                >
                  {variant.name}
                  {!variant.inStock && " (Out of Stock)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <div className="font-semibold">Quantity</div>
          <div className="flex w-full items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
              <span className="sr-only">Decrease quantity</span>
            </Button>
            <div className="flex h-8 w-12 items-center justify-center font-semibold">
              {quantity}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setQuantity(quantity + 1)}
              disabled={quantity >= product.stock}
            >
              <Plus className="h-3 w-3" />
              <span className="sr-only">Increase quantity</span>
            </Button>
          </div>
        </div>
        <Button
          className="w-full"
          size="lg"
          onClick={() => {
            const selectedVariant = product.variants.find(v => v.id === form.watch("variant"))
            addItem({
              id: `${product.id}-${selectedVariant?.id || "default"}`,
              productId: product.id,
              name: product.name,
              price: product.price,
              quantity: quantity,
              image: product.images[0],
              artisan: product.artisan,
              variant: selectedVariant,
            })
          }}
          disabled={!product.stock}
        >
          {product.stock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
      <Separator className="my-4" />
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="font-semibold">Artisan</div>
          <div className="flex items-center gap-2">
            <Image
              src={product.artisan.image || "/placeholder.svg"}
              alt={product.artisan.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="flex-1">
              <Link
                href={`/artisan/${product.artisan.id}`}
                className="font-semibold hover:underline"
              >
                {product.artisan.name}
              </Link>
              <div className="text-sm text-muted-foreground">
                {product.artisan.region}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {product.artisan.products} products
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

