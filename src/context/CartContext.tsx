import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { CartItem, Product } from '../types'

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; quantity?: number }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'CLOSE_CART' }

interface CartContextValue {
  items: CartItem[]
  isOpen: boolean
  totalItems: number
  subtotal: number
  shipping: number
  total: number
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  closeCart: () => void
}

const SHIPPING_THRESHOLD = 50
const SHIPPING_COST = 5.90

function calcTotals(items: CartItem[]) {
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  return { subtotal, shipping, total: subtotal + shipping }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.product.id === action.product.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + (action.quantity ?? 1) }
              : i
          ),
          isOpen: true,
        }
      }
      return {
        ...state,
        items: [...state.items, { product: action.product, quantity: action.quantity ?? 1 }],
        isOpen: true,
      }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.product.id !== action.productId) }
    case 'UPDATE_QUANTITY':
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter(i => i.product.id !== action.productId) }
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.product.id === action.productId ? { ...i, quantity: action.quantity } : i
        ),
      }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }
    case 'CLOSE_CART':
      return { ...state, isOpen: false }
    default:
      return state
  }
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false })
  const { subtotal, shipping, total } = calcTotals(state.items)
  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        totalItems,
        subtotal,
        shipping,
        total,
        addItem: (product, quantity) => dispatch({ type: 'ADD_ITEM', product, quantity }),
        removeItem: id => dispatch({ type: 'REMOVE_ITEM', productId: id }),
        updateQuantity: (id, qty) => dispatch({ type: 'UPDATE_QUANTITY', productId: id, quantity: qty }),
        clearCart: () => dispatch({ type: 'CLEAR_CART' }),
        toggleCart: () => dispatch({ type: 'TOGGLE_CART' }),
        closeCart: () => dispatch({ type: 'CLOSE_CART' }),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
