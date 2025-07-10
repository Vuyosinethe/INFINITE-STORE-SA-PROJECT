"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import { promoCodes } from "@/lib/promo-codes"

export interface CartItem {
  id: string
  name: string
  price: number
  image?: string
  size: string
  quantity: number
}

export interface PromoCode {
  code: string
  discount: number
  type: "percentage" | "fixed"
}

interface CartState {
  items: CartItem[]
  promoCode: PromoCode | null
  discount: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { id: string; size: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; size: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "APPLY_PROMO_CODE"; payload: string }
  | { type: "REMOVE_PROMO_CODE" }
  | { type: "LOAD_CART"; payload: CartState }

const initialState: CartState = {
  items: [],
  promoCode: null,
  discount: 0,
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id && item.size === action.payload.size,
      )

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex].quantity += action.payload.quantity
        return { ...state, items: updatedItems }
      }

      return { ...state, items: [...state.items, action.payload] }
    }

    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter((item) => !(item.id === action.payload.id && item.size === action.payload.size)),
      }
    }

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => !(item.id === action.payload.id && item.size === action.payload.size)),
        }
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id && item.size === action.payload.size
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      }
    }

    case "CLEAR_CART": {
      return { ...state, items: [], promoCode: null, discount: 0 }
    }

    case "APPLY_PROMO_CODE": {
      const promo = promoCodes.find((p) => p.code.toLowerCase() === action.payload.toLowerCase())
      if (!promo) {
        return state
      }

      const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const discount = promo.type === "percentage" ? (subtotal * promo.discount) / 100 : promo.discount

      return {
        ...state,
        promoCode: promo,
        discount: Math.min(discount, subtotal),
      }
    }

    case "REMOVE_PROMO_CODE": {
      return { ...state, promoCode: null, discount: 0 }
    }

    case "LOAD_CART": {
      return action.payload
    }

    default:
      return state
  }
}

interface CartContextType {
  items: CartItem[]
  promoCode: PromoCode | null
  discount: number
  addItem: (item: CartItem) => void
  removeItem: (id: string, size: string) => void
  updateQuantity: (id: string, size: string, quantity: number) => void
  clearCart: () => void
  applyPromoCode: (code: string) => boolean
  removePromoCode: () => void
  getSubtotal: () => number
  getTotal: () => number
  getItemCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", payload: parsedCart })
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(state))
    } catch (error) {
      console.error("Error saving cart to localStorage:", error)
    }
  }, [state])

  const addItem = (item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item })
  }

  const removeItem = (id: string, size: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id, size } })
  }

  const updateQuantity = (id: string, size: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, size, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const applyPromoCode = (code: string): boolean => {
    const promo = promoCodes.find((p) => p.code.toLowerCase() === code.toLowerCase())
    if (promo) {
      dispatch({ type: "APPLY_PROMO_CODE", payload: code })
      return true
    }
    return false
  }

  const removePromoCode = () => {
    dispatch({ type: "REMOVE_PROMO_CODE" })
  }

  const getSubtotal = (): number => {
    return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const getTotal = (): number => {
    const subtotal = getSubtotal()
    return Math.max(0, subtotal - state.discount)
  }

  const getItemCount = (): number => {
    return state.items.reduce((sum, item) => sum + item.quantity, 0)
  }

  const value: CartContextType = {
    items: state.items,
    promoCode: state.promoCode,
    discount: state.discount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyPromoCode,
    removePromoCode,
    getSubtotal,
    getTotal,
    getItemCount,
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
