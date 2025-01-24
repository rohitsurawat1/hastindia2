export interface NavItem {
    title: string
    href: string
    description?: string
  }
  
  export interface NavItemWithChildren extends NavItem {
    items: NavItem[]
  }
  
  export interface MainNavItem extends NavItem {}
  
  export interface SidebarNavItem extends NavItemWithChildren {}
  
  export interface User {
    id: string
    name: string
    email: string
    image?: string
    role: "admin" | "artisan" | "customer"
  }
  
  export interface Product {
    id: string
    name: string
    description: string
    price: number
    images: string[]
    category: string
    artisan: {
      id: string
      name: string
      region: string
    }
    rating: number
    reviews: number
    inStock: boolean
  }
  
  