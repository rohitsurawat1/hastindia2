"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ProductGalleryProps {
  images: string[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [mainCarouselRef, mainCarousel] = useEmblaCarousel()
  const [thumbCarouselRef, thumbCarousel] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  })

  const scrollPrev = React.useCallback(() => {
    if (mainCarousel) mainCarousel.scrollPrev()
  }, [mainCarousel])

  const scrollNext = React.useCallback(() => {
    if (mainCarousel) mainCarousel.scrollNext()
  }, [mainCarousel])

  const onThumbClick = React.useCallback(
    (index: number) => {
      if (!mainCarousel || !thumbCarousel) return
      mainCarousel.scrollTo(index)
    },
    [mainCarousel, thumbCarousel]
  )

  const onSelect = React.useCallback(() => {
    if (!mainCarousel || !thumbCarousel) return
    setSelectedIndex(mainCarousel.selectedScrollSnap())
    thumbCarousel.scrollTo(mainCarousel.selectedScrollSnap())
  }, [mainCarousel, thumbCarousel])

  React.useEffect(() => {
    if (!mainCarousel) return
    mainCarousel.on("select", onSelect)
    mainCarousel.on("reInit", onSelect)
  }, [mainCarousel, onSelect])

  return (
    <div className="flex w-full max-w-[600px] flex-col gap-2">
      <div className="relative overflow-hidden rounded-lg" ref={mainCarouselRef}>
        <div className="flex aspect-square">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative h-full w-full flex-[0_0_100%]"
            >
              <Image
                src={image}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white/90"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous slide</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white/90"
          onClick={scrollNext}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next slide</span>
        </Button>
      </div>
      <div className="relative overflow-hidden" ref={thumbCarouselRef}>
        <div className="flex gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              className={cn(
                "relative aspect-square w-20 flex-[0_0_auto] overflow-hidden rounded-lg border-2",
                index === selectedIndex
                  ? "border-primary"
                  : "border-transparent"
              )}
              onClick={() => onThumbClick(index)}
            >
              <Image
                src={image}
                alt={`Product thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

