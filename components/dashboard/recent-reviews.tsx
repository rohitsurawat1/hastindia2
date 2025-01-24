"use client"

import { Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const recentReviews = [
  {
    id: "1",
    customer: {
      name: "Meera Singh",
      image: "/placeholder.svg",
    },
    product: "Hand-painted Blue Pottery Vase",
    rating: 5,
    comment: "Beautiful craftsmanship! The colors are vibrant and the quality is excellent.",
    date: "2 days ago",
  },
  {
    id: "2",
    customer: {
      name: "Raj Malhotra",
      image: "/placeholder.svg",
    },
    product: "Handwoven Silk Scarf",
    rating: 4,
    comment: "Lovely texture and design. Shipping was quick.",
    date: "5 days ago",
  },
  {
    id: "3",
    customer: {
      name: "Anita Desai",
      image: "/placeholder.svg",
    },
    product: "Brass Decorative Lamp",
    rating: 5,
    comment: "Exceptional piece! The detailing is remarkable.",
    date: "1 week ago",
  },
]

export function RecentReviews() {
  return (
    <div className="space-y-8">
      {recentReviews.map((review) => (
        <div key={review.id} className="flex items-start space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={review.customer.image} alt={review.customer.name} />
            <AvatarFallback>
              {review.customer.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-semibold">{review.customer.name}</h4>
              <div className="flex items-center">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-primary text-primary"
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{review.product}</p>
            <p className="text-sm">{review.comment}</p>
            <p className="text-xs text-muted-foreground">{review.date}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

