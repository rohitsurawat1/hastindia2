"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus, Upload, X } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  story: z.string().min(50, "Story must be at least 50 characters"),
  category: z.string().min(1, "Please select a category"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid price"),
  compareAtPrice: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid price")
    .optional(),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  stock: z.string().regex(/^\d+$/, "Please enter a valid number"),
  dimensions: z.string().optional(),
  weight: z.string().optional(),
  material: z.string().min(3, "Material must be at least 3 characters"),
  careInstructions: z.string().min(10, "Care instructions must be at least 10 characters"),
})

export function ProductForm() {
  const router = useRouter()
  const [images, setImages] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([])

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      story: "",
      category: "",
      price: "",
      compareAtPrice: "",
      sku: "",
      stock: "1",
      dimensions: "",
      weight: "",
      material: "",
      careInstructions: "",
    },
  })

  async function onSubmit(values: z.infer<typeof productSchema>) {
    try {
      setUploading(true)

      if (images.length === 0) {
        toast({
          title: "Error",
          description: "Please add at least one product image",
          variant: "destructive",
        })
        return
      }

      // Upload images first
      const uploadedUrls = []
      for (const image of images) {
        toast({
          title: "Uploading image",
          description: `Uploading ${image.name}...`,
        })

        const formData = new FormData()
        formData.append("file", image)

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.details || "Failed to upload image")
        }

        const { url } = await res.json()
        uploadedUrls.push(url)
      }

      toast({
        title: "Creating product",
        description: "Please wait...",
      })

      // Create product with uploaded image URLs
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          images: uploadedUrls,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to create product")
      }

      toast({
        title: "Success",
        description: "Product created successfully!",
      })

      // Add a small delay before redirecting
      setTimeout(() => {
        router.push("/dashboard/products")
        router.refresh()
      }, 1500)
    } catch (error) {
      console.error("Product creation error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    setImages((prev) => [...prev, ...files])

    // Create preview URLs
    const urls = files.map((file) => URL.createObjectURL(file))
    setImageUrls((prev) => [...prev, ...urls])
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setImageUrls((prev) => {
      // Revoke the URL to prevent memory leaks
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-2">
          <FormLabel>Product Images</FormLabel>
          <div className="flex flex-wrap gap-4">
            {imageUrls.map((url, index) => (
              <div key={url} className="relative">
                <Image
                  src={url || "/placeholder.svg"}
                  alt={`Product image ${index + 1}`}
                  width={100}
                  height={100}
                  className="rounded-lg object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <label className="flex h-[100px] w-[100px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400">
              <div className="flex flex-col items-center gap-1">
                <Upload className="h-6 w-6" />
                <span className="text-xs">Upload</span>
              </div>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
            </label>
          </div>
          <FormDescription>Upload high-quality images of your product. You can add multiple images.</FormDescription>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Handwoven Silk Scarf" {...field} />
              </FormControl>
              <FormDescription>The name of your product as it will appear to customers.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A beautiful handwoven silk scarf..." {...field} />
              </FormControl>
              <FormDescription>Provide a detailed description of your product.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="story"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Story</FormLabel>
              <FormControl>
                <Textarea placeholder="Share the story behind this product..." {...field} />
              </FormControl>
              <FormDescription>
                Tell the story behind your product, its cultural significance, and crafting process.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="textiles">Textiles</SelectItem>
                    <SelectItem value="pottery">Pottery</SelectItem>
                    <SelectItem value="jewelry">Jewelry</SelectItem>
                    <SelectItem value="woodwork">Woodwork</SelectItem>
                    <SelectItem value="metalwork">Metalwork</SelectItem>
                    <SelectItem value="paintings">Paintings</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input placeholder="SILK-001" {...field} />
                </FormControl>
                <FormDescription>Unique identifier for your product.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (₹)</FormLabel>
                <FormControl>
                  <Input placeholder="2499.99" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="compareAtPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Compare at Price (₹)</FormLabel>
                <FormControl>
                  <Input placeholder="2999.99" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="dimensions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dimensions</FormLabel>
                <FormControl>
                  <Input placeholder="200cm x 50cm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight</FormLabel>
                <FormControl>
                  <Input placeholder="100g" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="material"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Material</FormLabel>
              <FormControl>
                <Input placeholder="100% Pure Silk" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="careInstructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Care Instructions</FormLabel>
              <FormControl>
                <Textarea placeholder="Dry clean only..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={uploading}>
          {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Product
        </Button>
      </form>
    </Form>
  )
}

