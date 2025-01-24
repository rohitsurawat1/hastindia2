"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const recentOrders = [
  {
    id: "1",
    customer: {
      name: "Rahul Sharma",
      image: "/placeholder.svg",
      email: "r.sharma@example.com",
    },
    amount: 2499,
    status: "processing",
  },
  {
    id: "2",
    customer: {
      name: "Priya Patel",
      image: "/placeholder.svg",
      email: "priya.p@example.com",
    },
    amount: 1299,
    status: "shipped",
  },
  {
    id: "3",
    customer: {
      name: "Amit Kumar",
      image: "/placeholder.svg",
      email: "amit.k@example.com",
    },
    amount: 4999,
    status: "delivered",
  },
  {
    id: "4",
    customer: {
      name: "Sneha Reddy",
      image: "/placeholder.svg",
      email: "s.reddy@example.com",
    },
    amount: 899,
    status: "processing",
  },
]

export function RecentOrders() {
  return (
    <div className="space-y-8">
      {recentOrders.map((order) => (
        <div key={order.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={order.customer.image} alt={order.customer.name} />
            <AvatarFallback>
              {order.customer.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{order.customer.name}</p>
            <p className="text-sm text-muted-foreground">{order.customer.email}</p>
          </div>
          <div className="ml-auto font-medium">₹{order.amount}</div>
        </div>
      ))}
    </div>
  )
}

