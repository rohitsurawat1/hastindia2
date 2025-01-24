"use server"

import { auth } from "@/lib/auth"
import { uploadImage, generatePresignedUrl } from "@/lib/s3"

export async function getUploadUrl(fileType: string) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    const result = await generatePresignedUrl(fileType)
    return { success: true, ...result }
  } catch (error) {
    console.error("Failed to generate upload URL:", error)
    return { success: false, error: "Failed to generate upload URL" }
  }
}

export async function uploadProductImage(file: File) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    const buffer = await file.arrayBuffer()
    const result = await uploadImage(Buffer.from(buffer), file.type)

    return { success: true, ...result }
  } catch (error) {
    console.error("Failed to upload image:", error)
    return { success: false, error: "Failed to upload image" }
  }
}

