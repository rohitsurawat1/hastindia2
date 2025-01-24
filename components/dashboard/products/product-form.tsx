"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { X, Loader2, Plus, Upload } from "lucide-react"
import { toast } from "sonner"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { createProduct } from "@/lib/actions/product"
import { getUploadUrl, uploadProductImage } from "@/lib/actions/upload"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const categories = [
  { id: "textiles", name: "Textiles" },
  { id: "pottery", name: "Pottery" },
  { id: "jewelry", name: "Jewelry" },
  { id: "woodcraft", name: "Woodcraft" },
  { id: "metalwork", name: "Metalwork" },
]

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  story: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  price: z.string().min(1, "Price is required"),
  compareAtPrice: z.string().optional(),
  sku: z.string().optional(),
  stock: z.string().min(1, "Stock is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  featured: z.boolean().default(false),
  dimensions: z.string().optional(),
  weight: z.string().optional(),
  material: z.string().optional(),
  careInstructions: z.string().optional(),
})

type ProductFormValues = z.infer<typeof productSchema>

const defaultValues: Partial<ProductFormValues> = {
  images: [],
  featured: false,
}

interface UploadingFile {
  id: string
  file: File
  progress: number
  uploading: boolean
  error?: string
  url?: string
}

export function ProductForm() {
  const router = useRouter()
  const [uploadingFiles, setUploadingFiles] = React.useState<UploadingFile[]>([])
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
  })

  async function onSubmit(data: ProductFormValues) {
    startTransition(async () => {
      try {
        const result = await createProduct(data)

        if (result.success) {
          toast.success("Product created successfully")
          router.push("/dashboard/products")
        } else {
          toast.error(result.error || "Failed to create product")
        }
      } catch (error) {
        toast.error("Something went wrong")
        console.error(error)
      }
    })
  }

  const handleFiles = React.useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return

      // Create temporary file objects
      const newFiles = Array.from(files).map((file) => ({
        id: Math.random().toString(36).substring(7),
        file,
        progress: 0,
        uploading: true,
      }))

      setUploadingFiles((prev) => [...prev, ...newFiles])

      // Upload each file
      for (const fileObj of newFiles) {
        try {
          // Get presigned URL
          const { success, uploadUrl, url } = await getUploadUrl(fileObj.file.type)

          if (!success || !uploadUrl || !url) {
            throw new Error("Failed to get upload URL")
          }

          // Upload to S3
          const response = await fetch(uploadUrl, {
            method: "PUT",
            body: fileObj.file,
            headers: {
              "Content-Type": fileObj.file.type,
            },
          })

          if (!response.ok) {
            throw new Error("Failed to upload file")
          }

          // Update file status
          setUploadingFiles((prev) =>
            prev.map((f) => (f.id === fileObj.id ? { ...f, uploading: false, progress: 100, url } : f)),
          )

          // Add URL to form
          form.setValue("images", [...form.getValues("images"), url])

          toast.success("Image uploaded successfully")
        } catch (error) {
          console.error("Upload error:", error)
          setUploadingFiles((prev) =>
            prev.map((f) => (f.id === fileObj.id ? { ...f, uploading: false, error: "Upload failed" } : f)),
          )
          toast.error("Failed to upload image")
        }
      }
    },
    [form],
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>The basic information about your product.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Handwoven Cotton Saree" {...field} />
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
                    <Textarea
                      placeholder="A beautiful handwoven cotton saree..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Describe your product in detail. Include key features and benefits.</FormDescription>
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
                    <Textarea
                      placeholder="Share the story behind this product..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Share the story and cultural significance of your product.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Choose the category that best fits your product.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing & Inventory</CardTitle>
            <CardDescription>Set your product&apos;s price and manage inventory.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2499" {...field} />
                    </FormControl>
                    <FormDescription>The selling price in INR.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="compareAtPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compare at Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2999" {...field} />
                    </FormControl>
                    <FormDescription>Original price before discount.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="PRD-001" {...field} />
                    </FormControl>
                    <FormDescription>Unique identifier for your product.</FormDescription>
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
                      <Input type="number" placeholder="10" {...field} />
                    </FormControl>
                    <FormDescription>Available quantity.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured Product</FormLabel>
                    <FormDescription>Show this product in featured sections.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
            <CardDescription>Add photos of your product. You can add up to 8 images.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {form.watch("images").map((image, index) => (
                <div key={index} className="group relative aspect-square rounded-lg border bg-muted">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => {
                      const newImages = form.getValues("images").filter((_, i) => i !== index)
                      form.setValue("images", newImages)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {uploadingFiles.map((file) => (
                <div key={file.id} className="relative aspect-square rounded-lg border bg-muted">
                  {file.uploading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      <Upload className="h-8 w-8 animate-pulse" />
                      <Progress value={file.progress} className="mt-2 w-full" />
                    </div>
                  ) : file.error ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-destructive">
                      <X className="h-8 w-8" />
                      <span className="mt-2 text-xs">{file.error}</span>
                    </div>
                  ) : null}
                </div>
              ))}
              {form.watch("images").length + uploadingFiles.length < 8 && (
                <div className="aspect-square">
                  <label
                    htmlFor="images"
                    className={cn(
                      "relative flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-xs transition-colors hover:bg-accent",
                      (uploadingFiles.some((f) => f.uploading) || isPending) && "pointer-events-none opacity-50",
                    )}
                  >
                    <Plus className="h-8 w-8" />
                    <span className="text-muted-foreground">Add Image</span>
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFiles(e.target.files)}
                      disabled={uploadingFiles.some((f) => f.uploading) || isPending}
                    />
                  </label>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
            <CardDescription>Add more details about your product.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="dimensions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dimensions</FormLabel>
                    <FormControl>
                      <Input placeholder="20cm x 30cm" {...field} />
                    </FormControl>
                    <FormDescription>Product dimensions (optional).</FormDescription>
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
                      <Input placeholder="500g" {...field} />
                    </FormControl>
                    <FormDescription>Product weight (optional).</FormDescription>
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
                    <Input placeholder="100% Cotton" {...field} />
                  </FormControl>
                  <FormDescription>Main material(s) used (optional).</FormDescription>
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
                    <Textarea placeholder="Hand wash in cold water..." className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormDescription>Instructions for product care (optional).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => router.push("/dashboard/products")} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Product
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}

