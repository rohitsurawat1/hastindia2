import { hash } from "bcryptjs"
import { NextResponse } from "next/server"
import { z } from "zod"

import { prisma } from "@/lib/db"

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["CUSTOMER", "ARTISAN"]),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = registerSchema.parse(json)

    const exists = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    })

    if (exists) {
      return new NextResponse("User already exists", { status: 409 })
    }

    const hashedPassword = await hash(body.password, 10)

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: body.role,
      },
    })

    // If user is an artisan, create an artisan profile
    if (body.role === "ARTISAN") {
      await prisma.artisan.create({
        data: {
          userId: user.id,
          shopName: `${user.name}'s Shop`, // Default shop name
          region: "Not specified", // Default region
        },
      })
    }

    return new NextResponse("User created successfully", { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

