import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import sharp from "sharp"
import crypto from "crypto"

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

// Supported image types
const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "image/webp", "image/gif"]

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024

interface UploadResult {
  url: string
  key: string
}

interface PresignedUrlResult {
  uploadUrl: string
  key: string
  url: string
}

/**
 * Processes and uploads an image to S3
 * @param file - The image buffer to upload
 * @param mimeType - The MIME type of the image
 * @returns The URL and key of the uploaded image
 */
export async function uploadImage(file: Buffer, mimeType: string): Promise<UploadResult> {
  try {
    // Validate file type
    if (!SUPPORTED_FORMATS.includes(mimeType)) {
      throw new Error("Unsupported file type")
    }

    // Validate file size
    if (file.length > MAX_FILE_SIZE) {
      throw new Error("File too large")
    }

    // Process image with Sharp
    const processedImage = await sharp(file)
      .resize(1200, 1200, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .toBuffer()

    // Generate unique filename
    const extension = mimeType.split("/")[1]
    const fileName = `${crypto.randomBytes(16).toString("hex")}.${extension}`
    const key = `product-images/${fileName}`

    // Upload to S3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        Body: processedImage,
        ContentType: mimeType,
        CacheControl: "public, max-age=31536000",
      }),
    )

    // Return the URL and key
    return {
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
      key,
    }
  } catch (error) {
    console.error("Error uploading image:", error)
    throw new Error("Failed to upload image")
  }
}

/**
 * Generates a presigned URL for client-side uploads
 * @param mimeType - The MIME type of the file to be uploaded
 * @returns Object containing the upload URL, key, and final URL
 */
export async function generatePresignedUrl(mimeType: string): Promise<PresignedUrlResult> {
  try {
    // Validate file type
    if (!SUPPORTED_FORMATS.includes(mimeType)) {
      throw new Error("Unsupported file type")
    }

    // Generate unique filename
    const extension = mimeType.split("/")[1]
    const fileName = `${crypto.randomBytes(16).toString("hex")}.${extension}`
    const key = `product-images/${fileName}`

    // Generate presigned URL
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      ContentType: mimeType,
      CacheControl: "public, max-age=31536000",
    })

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })

    return {
      uploadUrl,
      key,
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    }
  } catch (error) {
    console.error("Error generating presigned URL:", error)
    throw new Error("Failed to generate upload URL")
  }
}

/**
 * Deletes an image from S3
 * @param key - The S3 key of the image to delete
 */
export async function deleteImage(key: string): Promise<void> {
  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
      }),
    )
  } catch (error) {
    console.error("Error deleting image:", error)
    throw new Error("Failed to delete image")
  }
}

/**
 * Gets a temporary URL for an image
 * @param key - The S3 key of the image
 * @returns Presigned URL for temporary access
 */
export async function getImageUrl(key: string): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    })

    return await getSignedUrl(s3Client, command, { expiresIn: 3600 })
  } catch (error) {
    console.error("Error getting image URL:", error)
    throw new Error("Failed to get image URL")
  }
}

/**
 * Validates an S3 key format
 * @param key - The S3 key to validate
 * @returns boolean indicating if the key is valid
 */
export function isValidKey(key: string): boolean {
  // Key must start with product-images/ and contain only allowed characters
  const keyRegex = /^product-images\/[a-f0-9]{32}\.(jpg|jpeg|png|webp|gif)$/
  return keyRegex.test(key)
}

