"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Filter, X } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

const filters = {
  category: [
    { id: "textiles", name: "Textiles" },
    { id: "pottery", name: "Pottery" },
    { id: "jewelry", name: "Jewelry" },
    { id: "woodcraft", name: "Woodcraft" },
    { id: "metalwork", name: "Metalwork" },
  ],
  region: [
    { id: "rajasthan", name: "Rajasthan" },
    { id: "gujarat", name: "Gujarat" },
    { id: "kashmir", name: "Kashmir" },
    { id: "bengal", name: "West Bengal" },
    { id: "kerala", name: "Kerala" },
  ],
  price: [
    { id: "0-500", name: "Under ₹500" },
    { id: "501-1000", name: "₹501 - ₹1,000" },
    { id: "1001-2000", name: "₹1,001 - ₹2,000" },
    { id: "2001-5000", name: "₹2,001 - ₹5,000" },
    { id: "5001", name: "Above ₹5,000" },
  ],
  rating: [
    { id: "4", name: "4★ & above" },
    { id: "3", name: "3★ & above" },
    { id: "2", name: "2★ & above" },
    { id: "1", name: "1★ & above" },
  ],
}

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = React.useTransition()
  const [isOpen, setIsOpen] = React.useState(false)

  // Create a map of active filters
  const activeFilters = React.useMemo(() => {
    const params = new URLSearchParams(searchParams)
    const filters: Record<string, string[]> = {}
    
    for (const [key, value] of params.entries()) {
      if (!filters[key]) {
        filters[key] = []
      }
      filters[key].push(value)
    }
    
    return filters
  }, [searchParams])

  // Update filters
  function updateFilters(key: string, value: string, checked: boolean) {
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      
      checked ? params.append(key, value) : params.delete(key, value)
      
      router.push(`/shop?${params.toString()}`)
    })
  }

  return (
    <div className="sticky top-20">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="flex lg:hidden">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <FilterContent
            filters={filters}
            activeFilters={activeFilters}
            updateFilters={updateFilters}
          />
        </SheetContent>
      </Sheet>
      <div className="hidden lg:block">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Filters</h2>
          {Object.keys(activeFilters).length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/shop")}
              className="h-auto p-0 text-muted-foreground"
            >
              Clear all
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <Separator className="my-4" />
        <FilterContent
          filters={filters}
          activeFilters={activeFilters}
          updateFilters={updateFilters}
        />
      </div>
    </div>
  )
}

function FilterContent({
  filters,
  activeFilters,
  updateFilters,
}: {
  filters: typeof filters
  activeFilters: Record<string, string[]>
  updateFilters: (key: string, value: string, checked: boolean) => void
}) {
  return (
    <ScrollArea className="h-[calc(100vh-10rem)]">
      <div className="space-y-4 pr-6">
        <Accordion type="multiple" defaultValue={Object.keys(filters)}>
          {Object.entries(filters).map(([key, values]) => (
            <AccordionItem key={key} value={key}>
              <AccordionTrigger className="text-sm capitalize">
                {key}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {values.map((value) => (
                    <div key={value.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`filter-${key}-${value.id}`}
                        checked={activeFilters[key]?.includes(value.id)}
                        onCheckedChange={(checked) =>
                          updateFilters(key, value.id, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`filter-${key}-${value.id}`}
                        className="text-sm font-normal"
                      >
                        {value.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </ScrollArea>
  )
}

