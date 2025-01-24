"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { toast } from "sonner"
import type { CartItem, CartState, CartStore } from "@/types/cart"

const initialState: CartState = {
  items: [], // Ensure items is always initialized as an empty array
  isOpen: false,
}

const CartContext = createContext<CartStore | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CartState>(initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("cart")
    if (stored) {
      try {
        const data = JSON.parse(stored)
        setState(prev => ({ 
          ...prev, 
          items: Array.isArray(data.items) ? data.items : [] 
        }))
      } catch (error) {
        console.error("Failed to parse stored cart:", error)
        setState(initialState)
      }
    }
  }, [])

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify({ items: state.items }))
  }, [state.items])

  const addItem = (item: CartItem) => {
    setState(prev => {
      const existingItem = prev.items.find(i => 
        i.productId === item.productId && 
        i.variant?.id === item.variant?.id
      )

      if (existingItem) {
        const newQuantity = existingItem.quantity + item.quantity
        const updatedItems = prev.items.map(i =>
          i.id === existingItem.id
            ? { ...i, quantity: Math.min(newQuantity, 99) }
            : i
        )
        return { ...prev, items: updatedItems, isOpen: true }
      }

      return {
        ...prev,
        items: [...prev.items, item],
        isOpen: true,
      }
    })

    toast.success("Added to cart", {
      description: `${item.name} ${item.variant ? `(${item.variant.name})` : ""}`
    })
  }

  const removeItem = (itemId: string) => {
    setState(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId),
    }))
    toast.success("Removed from cart")
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1 || quantity > 99) return

    setState(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    }))
  }

  const clearCart = () => {
    setState(prev => ({ ...prev, items: [] }))
    toast.success("Cart cleared")
  }

  const setIsOpen = (isOpen: boolean) => {
    setState(prev => ({ ...prev, isOpen }))
  }

  const value = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setIsOpen,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

