// ─── Vehicle Types ────────────────────────────────────────────────────────────

export interface VehicleMake {
  id: string
  name: string
  logo?: string
}

export interface VehicleModel {
  id: string
  makeId: string
  name: string
}

export interface VehicleYear {
  year: number
}

export interface SelectedVehicle {
  make: VehicleMake
  model: VehicleModel
  year: number
}

// ─── Product Types ────────────────────────────────────────────────────────────

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  description: string
  productCount: number
  parentId?: string
}

export interface Product {
  id: string
  reference: string
  name: string
  brand: string
  categoryId: string
  categoryName: string
  price: number
  originalPrice?: number
  stock: number
  images: string[]
  description: string
  shortDescription: string
  compatibleVehicles: string[]
  specifications: Record<string, string>
  rating: number
  reviewCount: number
  isPromo: boolean
  isBestSeller: boolean
  tags: string[]
}

// ─── Cart Types ───────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  totalItems: number
  subtotal: number
  shipping: number
  total: number
}

// ─── Order Types ──────────────────────────────────────────────────────────────

export interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  street: string
  city: string
  postalCode: string
  country: string
}

export interface Order {
  id: string
  items: CartItem[]
  shippingAddress: ShippingAddress
  paymentMethod: 'card' | 'paypal' | 'transfer'
  subtotal: number
  shipping: number
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  createdAt: Date
}

// ─── Filter Types ─────────────────────────────────────────────────────────────

export interface ProductFilters {
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  brands?: string[]
  inStock?: boolean
  isPromo?: boolean
  search?: string
}
