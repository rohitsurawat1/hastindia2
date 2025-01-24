import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";
import sharp from "sharp";

// Initialize clients
const s3Client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const prisma = new PrismaClient();

async function testProductCreation() {
  try {
    console.log("🚀 Starting product creation test...");

    // 1. First, let's create a test image
    console.log("\n📸 Creating test image...");
    const imageBuffer = await sharp({
      create: {
        width: 300,
        height: 300,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
    .jpeg()
    .toBuffer();

    // 2. Upload image to S3
    console.log("\n📤 Uploading image to S3...");
    const imageKey = `test/product-${Date.now()}.jpg`;
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageKey,
        Body: imageBuffer,
        ContentType: 'image/jpeg'
        // Removed ACL parameter
      })
    );
    
    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.eu-north-1.amazonaws.com/${imageKey}`;
    console.log("✅ Image uploaded successfully!");
    console.log("📍 Image URL:", imageUrl);

    // 3. Get the first artisan from the database
    console.log("\n🔍 Finding test artisan...");
    const artisan = await prisma.artisan.findFirst();
    
    if (!artisan) {
      throw new Error("No artisan found in database");
    }
    console.log("✅ Found artisan:", artisan.shopName);

    // 4. Create a test product
    console.log("\n📦 Creating test product...");
    const product = await prisma.product.create({
      data: {
        name: "Test Handwoven Silk Scarf",
        description: "A beautiful handwoven silk scarf made with traditional techniques.",
        story: "This scarf represents centuries of weaving tradition...",
        category: "textiles",
        price: 2499.99,
        compareAtPrice: 2999.99,
        sku: `TEST-${Date.now()}`,
        stock: 10,
        images: [imageUrl],
        featured: true,
        dimensions: "200cm x 50cm",
        weight: "100g",
        material: "100% Pure Silk",
        careInstructions: "Dry clean only",
        artisanId: artisan.id
      }
    });

    console.log("\n✨ Product created successfully!");
    console.log("\nProduct details:");
    console.log(JSON.stringify(product, null, 2));

    // 5. Verify the product was created
    console.log("\n🔍 Verifying product creation...");
    const verifiedProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: { artisan: true }
    });

    if (!verifiedProduct) {
      throw new Error("Failed to verify product creation");
    }

    console.log("✅ Product verification successful!");
    console.log("\nVerified product details:");
    console.log({
      id: verifiedProduct.id,
      name: verifiedProduct.name,
      artisan: verifiedProduct.artisan.shopName,
      price: verifiedProduct.price,
      images: verifiedProduct.images
    });

  } catch (error) {
    console.error("\n❌ Error:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testProductCreation();