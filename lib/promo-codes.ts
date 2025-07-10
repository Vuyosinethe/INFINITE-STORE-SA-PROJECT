export interface PromoCode {
  code: string
  discount: number // percentage discount (e.g., 10 for 10%)
  discountType: "percentage" | "fixed" // percentage or fixed amount
  expiryDate: string // ISO date string
  maxUses: number // maximum number of times this code can be used
  currentUses: number // current number of uses
  description: string
  minOrderAmount?: number // minimum order amount to apply discount
}

export const promoCodes: PromoCode[] = [
  {
    code: "WELCOME10",
    discount: 10,
    discountType: "percentage",
    expiryDate: "2025-02-28T23:59:59.000Z", // Valid for 1 month
    maxUses: 100,
    currentUses: 0,
    description: "10% off for new customers",
    minOrderAmount: 1000,
  },
  {
    code: "JERSEY25",
    discount: 25,
    discountType: "percentage",
    expiryDate: "2025-02-15T23:59:59.000Z",
    maxUses: 5, // Only 5 customers can use this
    currentUses: 0,
    description: "25% off all jerseys - Limited to 5 customers!",
    minOrderAmount: 1500,
  },
  {
    code: "SAVE200",
    discount: 200,
    discountType: "fixed",
    expiryDate: "2025-03-31T23:59:59.000Z",
    maxUses: 50,
    currentUses: 0,
    description: "R200 off orders over R3000",
    minOrderAmount: 3000,
  },
  {
    code: "BIGDEAL",
    discount: 30,
    discountType: "percentage",
    expiryDate: "2025-01-31T23:59:59.000Z",
    maxUses: 1, // Single use code
    currentUses: 0,
    description: "30% off everything - One time use only!",
    minOrderAmount: 2000,
  },
]

export function validatePromoCode(
  code: string,
  orderTotal: number,
): {
  isValid: boolean
  error?: string
  promoCode?: PromoCode
} {
  const promoCode = promoCodes.find((p) => p.code.toLowerCase() === code.toLowerCase())

  if (!promoCode) {
    return { isValid: false, error: "Invalid promo code" }
  }

  // Check if expired
  const now = new Date()
  const expiryDate = new Date(promoCode.expiryDate)
  if (now > expiryDate) {
    return { isValid: false, error: "This promo code has expired" }
  }

  // Check usage limit
  if (promoCode.currentUses >= promoCode.maxUses) {
    return { isValid: false, error: "This promo code has reached its usage limit" }
  }

  // Check minimum order amount
  if (promoCode.minOrderAmount && orderTotal < promoCode.minOrderAmount) {
    return {
      isValid: false,
      error: `Minimum order amount of R${promoCode.minOrderAmount} required for this code`,
    }
  }

  // Check if user has already used this code (stored in localStorage)
  const usedCodes = JSON.parse(localStorage.getItem("usedPromoCodes") || "[]")
  if (usedCodes.includes(code.toLowerCase())) {
    return { isValid: false, error: "You have already used this promo code" }
  }

  return { isValid: true, promoCode }
}

export function calculateDiscount(promoCode: PromoCode, orderTotal: number): number {
  if (promoCode.discountType === "percentage") {
    return Math.round((orderTotal * promoCode.discount) / 100)
  } else {
    return Math.min(promoCode.discount, orderTotal) // Don't discount more than the order total
  }
}

export function applyPromoCode(code: string) {
  // Mark code as used by current user
  const usedCodes = JSON.parse(localStorage.getItem("usedPromoCodes") || "[]")
  usedCodes.push(code.toLowerCase())
  localStorage.setItem("usedPromoCodes", JSON.stringify(usedCodes))

  // Increment usage count (in a real app, this would be done on the server)
  const promoCode = promoCodes.find((p) => p.code.toLowerCase() === code.toLowerCase())
  if (promoCode) {
    promoCode.currentUses += 1
  }
}
