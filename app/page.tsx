import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from 'lucide-react'

import { siteConfig } from "@/config/theme"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="container relative">
      <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
        <h1 className="text-center font-heading text-3xl leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Discover the Beauty of{" "}
          <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            Indian Craftsmanship
          </span>
        </h1>
        <p className="max-w-[700px] text-center text-lg text-muted-foreground sm:text-xl">
          Connect with skilled artisans and explore unique handcrafted treasures
          from across India
        </p>
        <div className="flex gap-4">
          <Link
            href="/shop"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-gradient-to-r from-orange-500 to-amber-500"
            )}
          >
            Shop Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/artisans"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            Meet Our Artisans
          </Link>
        </div>
      </section>
      <section className="grid grid-cols-1 gap-6 py-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Featured categories will go here */}
      </section>
    </div>
  )
}

