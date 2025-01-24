import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ArtisanProfileForm } from "@/components/forms/artisan-profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/login")
  }

  // Check if artisan profile already exists
  const existingProfile = await prisma.artisan.findFirst({
    where: { userId: session.user.id },
  })

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Artisan Profile</CardTitle>
          <CardDescription>
            {existingProfile
              ? "Update your artisan profile information"
              : "Create your artisan profile to start selling your products"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ArtisanProfileForm existingProfile={existingProfile} />
        </CardContent>
      </Card>
    </div>
  )
}

