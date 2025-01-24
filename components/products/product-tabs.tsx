"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ProductTabsProps {
  product: any // Type this properly based on your product type
}

export function ProductTabs({ product }: ProductTabsProps) {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
        <TabsTrigger
          value="description"
          className="relative rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground"
        >
          Description
        </TabsTrigger>
        <TabsTrigger
          value="specifications"
          className="relative rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground"
        >
          Specifications
        </TabsTrigger>
        <TabsTrigger
          value="story"
          className="relative rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground"
        >
          Story & Process
        </TabsTrigger>
      </TabsList>
      <TabsContent value="description" className="pt-4">
        <div className="prose max-w-none dark:prose-invert">
          <p>{product.description}</p>
        </div>
      </TabsContent>
      <TabsContent value="specifications" className="pt-4">
        <div className="prose max-w-none dark:prose-invert">
          <ul>
            <li>
              <strong>Material:</strong> {product.specifications.material}
            </li>
            <li>
              <strong>Dimensions:</strong> {product.specifications.dimensions}
            </li>
            <li>
              <strong>Weight:</strong> {product.specifications.weight}
            </li>
          </ul>
          <h3>Care Instructions</h3>
          <ul>
            {product.specifications.careInstructions.map(
              (instruction: string, index: number) => (
                <li key={index}>{instruction}</li>
              )
            )}
          </ul>
        </div>
      </TabsContent>
      <TabsContent value="story" className="space-y-4 pt-4">
        <div className="prose max-w-none dark:prose-invert">
          <h3>The Story</h3>
          <p>{product.story}</p>
          <h3>The Process</h3>
          <p>{product.process}</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}

