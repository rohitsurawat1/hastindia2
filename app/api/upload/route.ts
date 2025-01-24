import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { NextResponse } from "next/server"

const s3Client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  endpoint: `https://s3.eu-north-1.amazonaws.com`,
})

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Log file details for debugging
    console.log("Uploading file:", {
      name: file.name,
      type: file.type,
      size: file.size,
    })

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileKey = `products/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "-")}`

    console.log("Attempting S3 upload with:", {
      bucket: process.env.AWS_BUCKET_NAME,
      fileKey,
      contentType: file.type,
    })

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
        Body: buffer,
        ContentType: file.type,
      }),
    )

    const url = `https://${process.env.AWS_BUCKET_NAME}.s3.eu-north-1.amazonaws.com/${fileKey}`

    console.log("Upload successful:", url)

    return NextResponse.json({ url })
  } catch (error) {
    console.error("Upload error details:", {
      error,
      bucket: process.env.AWS_BUCKET_NAME,
      region: "eu-north-1",
    })

    return NextResponse.json(
      { error: "Upload failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

