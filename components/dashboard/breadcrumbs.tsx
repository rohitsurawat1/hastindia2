import Link from "next/link"
import { ChevronRight } from 'lucide-react'

interface BreadcrumbsProps {
  segments: {
    title: string
    href: string
  }[]
}

export function Breadcrumbs({ segments }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Link
        href="/dashboard"
        className="hover:text-foreground"
      >
        Dashboard
      </Link>
      {segments.map((segment, index) => (
        <span key={segment.href} className="flex items-center">
          <ChevronRight className="h-4 w-4" />
          <Link
            href={segment.href}
            className={
              index === segments.length - 1
                ? "font-medium text-foreground"
                : "hover:text-foreground"
            }
          >
            {segment.title}
          </Link>
        </span>
      ))}
    </nav>
  )
}

