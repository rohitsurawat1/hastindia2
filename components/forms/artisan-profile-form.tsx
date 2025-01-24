"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import type { Artisan } from "@prisma/client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

const profileSchema = z.object({
  shopName: z.string().min(3, "Shop name must be at least 3 characters"),
  bio: z.string().min(50, "Bio must be at least 50 characters").optional(),
  region: z.string().min(2, "Please enter your region"),
  phone: z.string().min(10, "Please enter a valid phone number").optional(),
  address: z.string().min(10, "Please enter your complete address").optional(),
})

interface ArtisanProfileFormProps {
  existingProfile?: Artisan | null
}

export function ArtisanProfileForm({ existingProfile }: ArtisanProfileFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      shopName: existingProfile?.shopName || "",
      bio: existingProfile?.bio || "",
      region: existingProfile?.region || "",
      phone: existingProfile?.phone || "",
      address: existingProfile?.address || "",
    },
  })

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    try {
      setIsSubmitting(true)

      const res = await fetch("/api/artisan/profile", {
        method: existingProfile ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      toast({
        title: "Success",
        description: existingProfile ? "Profile updated successfully" : "Profile created successfully",
      })

      router.refresh()
      router.push("/dashboard/products")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="shopName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shop Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Craft Shop" {...field} />
              </FormControl>
              <FormDescription>This is the name that will be displayed to customers.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your craft and experience..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>Share your story, experience, and what makes your craft unique.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Region</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Rajasthan" {...field} />
              </FormControl>
              <FormDescription>The region where you and your craft are based.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+91 1234567890" {...field} />
              </FormControl>
              <FormDescription>Your contact number for order coordination.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea placeholder="Your complete address..." className="min-h-[100px]" {...field} />
              </FormControl>
              <FormDescription>Your workshop or business address.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {existingProfile ? "Update Profile" : "Create Profile"}
        </Button>
      </form>
    </Form>
  )
}

