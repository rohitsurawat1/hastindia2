export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"

export interface OrderItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  variant?: {
    id: string
    name: string
  }
}

export interface ShippingInfo {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
}

export interface Order {
  id: string
  userId: string
  artisanId: string
  items: OrderItem[]
  status: OrderStatus
  total: number
  shippingInfo: ShippingInfo
  paymentInfo?: {
    paymentId: string
    orderId: string
  }
  tracking?: {
    number?: string
    courier?: string
    url?: string
  }
  timeline: {
    status: OrderStatus
    timestamp: string
    comment?: string
  }[]
  createdAt: string
  updatedAt: string
}

