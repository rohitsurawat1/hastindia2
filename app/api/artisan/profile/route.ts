import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Log the entire session for debugging
    console.log("Current session:", session)

    if (!session?.user?.id) {
      console.log("No session or user ID found:", session)
      return NextResponse.json({ error: "Unauthorized - User ID not found" }, { status: 401 })
    }

    console.log("Creating profile for user ID:", session.user.id)

    // Verify the user exists and get their current data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        artisan: true,
      },
    })

    if (!user) {
      console.log("User not found for ID:", session.user.id)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    console.log("Found user:", {
      id: user.id,
      email: user.email,
      role: user.role,
      hasArtisan: !!user.artisan,
    })

    if (user.artisan) {
      return NextResponse.json({ error: "Profile already exists" }, { status: 400 })
    }

    const json = await request.json()

    // Validate required fields
    if (!json.shopName || !json.region) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Update user role to ARTISAN if it's not already
    if (user.role !== "ARTISAN") {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: "ARTISAN" },
      })
    }

    // Create the artisan profile
    const artisan = await prisma.artisan.create({
      data: {
        userId: user.id,
        shopName: json.shopName,
        bio: json.bio || null,
        region: json.region,
        phone: json.phone || null,
        address: json.address || null,
      },
    })

    console.log("Created artisan profile:", artisan)

    return NextResponse.json(artisan)
  } catch (error) {
    console.error("Profile creation error:", {
      error,
      message: error.message,
      code: error.code,
      meta: error.meta,
    })

    if (error.code === "P2002") {
      return NextResponse.json({ error: "Profile already exists for this user" }, { status: 400 })
    }

    if (error.code === "P2003") {
      return NextResponse.json({ error: "Invalid user ID or user not found" }, { status: 400 })
    }

    return NextResponse.json(
      {
        error: "Failed to create profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

