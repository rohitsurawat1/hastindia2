import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { authOptions } from "@/lib/auth/auth-options"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ARTISAN") {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}

