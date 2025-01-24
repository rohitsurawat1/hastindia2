export interface CartItem {
    id: string
    productId: string
    name: string
    price: number
    quantity: number
    image: string
    artisan: {
      id: string
      name: string
      region: string
    }
    variant?: {
      id: string
      name: string
    }
  }
  
  export interface CartState {
    items: CartItem[]
    isOpen: boolean
  }
  
  export interface CartStore extends CartState {
    addItem: (item: CartItem) => void
    removeItem: (itemId: string) => void
    updateQuantity: (itemId: string, quantity: number) => void
    clearCart: () => void
    setIsOpen: (isOpen: boolean) => void
  }
  
  