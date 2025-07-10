"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ShoppingBag,
  AlertCircle,
  Info,
} from "lucide-react"

interface OrderItem {
  id: string
  name: string
  size: string
  quantity: number
  price: number
  image: string
}

interface Order {
  reference: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  amount: number
  items: OrderItem[]
  customer: {
    name: string
    email: string
    phone?: string
  }
  createdAt: string
  estimatedDelivery?: string
  trackingNumber?: string
  shippingAddress?: string
}

// Mock order data for demonstration
const mockOrders: Order[] = [
  {
    reference: "INF1752179324618",
    status: "processing",
    amount: 1500,
    items: [
      {
        id: "aston-villa-home",
        name: "Aston Villa 24/25 Home Jersey",
        size: "L",
        quantity: 1,
        price: 1500,
        image: "/images/jerseys/aston-villa-2425-home-front.jpeg",
      },
    ],
    customer: {
      name: "Vuyo Sinethe",
      email: "2355730@students.wits.ac.za",
      phone: "+27612707020",
    },
    createdAt: "2025-07-10T20:28:36.948Z",
    estimatedDelivery: "2025-07-15",
    trackingNumber: "PF123456789SA",
  },
  {
    reference: "INF1752179856422",
    status: "shipped",
    amount: 1500,
    items: [
      {
        id: "arsenal-away",
        name: "Arsenal 24/25 Away Jersey",
        size: "M",
        quantity: 1,
        price: 1500,
        image: "/images/jerseys/arsenal-2425-away-front.jpeg",
      },
    ],
    customer: {
      name: "Vuyo Sinethe",
      email: "2355730@students.wits.ac.za",
      phone: "+27612707020",
    },
    createdAt: "2025-07-10T20:37:29.324Z",
    estimatedDelivery: "2025-07-14",
    trackingNumber: "PF987654321SA",
    shippingAddress: "Johannesburg, Gauteng",
  },
  {
    reference: "INF1752180000000",
    status: "delivered",
    amount: 2800,
    items: [
      {
        id: "real-madrid-home",
        name: "Real Madrid 24/25 Home Jersey",
        size: "XL",
        quantity: 1,
        price: 1500,
        image: "/images/jerseys/real-madrid-2425-home-front.jpeg",
      },
      {
        id: "barcelona-away",
        name: "Barcelona 24/25 Away Jersey",
        size: "L",
        quantity: 1,
        price: 1300,
        image: "/images/jerseys/barcelona-2425-away-front.jpeg",
      },
    ],
    customer: {
      name: "John Smith",
      email: "john@example.com",
      phone: "+27123456789",
    },
    createdAt: "2025-07-08T14:30:00.000Z",
    estimatedDelivery: "2025-07-12",
    trackingNumber: "PF555666777SA",
    shippingAddress: "Cape Town, Western Cape",
  },
]

const getStatusColor = (status: Order["status"]) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "processing":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "shipped":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "delivered":
      return "bg-green-100 text-green-800 border-green-200"
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getStatusIcon = (status: Order["status"]) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4" />
    case "processing":
      return <Package className="h-4 w-4" />
    case "shipped":
      return <Truck className="h-4 w-4" />
    case "delivered":
      return <CheckCircle className="h-4 w-4" />
    case "cancelled":
      return <AlertCircle className="h-4 w-4" />
    default:
      return <Info className="h-4 w-4" />
  }
}

const getStatusSteps = (status: Order["status"]) => {
  const steps = [
    { key: "pending", label: "Order Placed", completed: true },
    { key: "processing", label: "Processing", completed: status !== "pending" },
    { key: "shipped", label: "Shipped", completed: status === "shipped" || status === "delivered" },
    { key: "delivered", label: "Delivered", completed: status === "delivered" },
  ]

  return steps
}

export default function TrackOrderPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter an order reference number")
      return
    }

    setIsSearching(true)
    setError("")

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const order = mockOrders.find(
      (o) =>
        o.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    if (order) {
      setSearchedOrder(order)
      setError("")
    } else {
      setSearchedOrder(null)
      setError("Order not found. Please check your order reference number and try again.")
    }

    setIsSearching(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Track Your Order</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter your order reference number or tracking number to see the current status and location of your order.
          </p>
        </div>

        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Order Lookup
            </CardTitle>
            <CardDescription>Enter your order reference (e.g., INF1752179324618) or tracking number</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="orderSearch" className="sr-only">
                  Order Reference or Tracking Number
                </Label>
                <Input
                  id="orderSearch"
                  type="text"
                  placeholder="Enter order reference or tracking number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isSearching}
                />
              </div>
              <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()} className="px-8">
                {isSearching ? "Searching..." : "Track Order"}
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Sample Order References */}
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-2">Try these sample order references:</p>
              <div className="flex flex-wrap gap-2">
                {mockOrders.map((order) => (
                  <Button
                    key={order.reference}
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery(order.reference)}
                    className="text-xs"
                  >
                    {order.reference}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        {searchedOrder && (
          <div className="space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order {searchedOrder.reference}
                  </CardTitle>
                  <Badge className={getStatusColor(searchedOrder.status)}>
                    {getStatusIcon(searchedOrder.status)}
                    <span className="ml-1 capitalize">{searchedOrder.status}</span>
                  </Badge>
                </div>
                <CardDescription>
                  Placed on{" "}
                  {new Date(searchedOrder.createdAt).toLocaleDateString("en-ZA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Progress Timeline */}
                <div className="space-y-4">
                  <h4 className="font-medium">Order Progress</h4>
                  <div className="flex items-center justify-between">
                    {getStatusSteps(searchedOrder.status).map((step, index) => (
                      <div key={step.key} className="flex flex-col items-center flex-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step.completed ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <div className="w-2 h-2 bg-current rounded-full" />
                          )}
                        </div>
                        <span
                          className={`text-xs mt-2 text-center ${
                            step.completed ? "text-green-600 font-medium" : "text-gray-500"
                          }`}
                        >
                          {step.label}
                        </span>
                        {index < getStatusSteps(searchedOrder.status).length - 1 && (
                          <div
                            className={`absolute h-0.5 w-full mt-4 ${step.completed ? "bg-green-500" : "bg-gray-200"}`}
                            style={{
                              left: "50%",
                              right: "-50%",
                              zIndex: -1,
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Order Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Calendar className="h-4 w-4" />
                      Estimated Delivery
                    </div>
                    <p className="text-sm text-gray-600">
                      {searchedOrder.estimatedDelivery
                        ? new Date(searchedOrder.estimatedDelivery).toLocaleDateString("en-ZA", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "TBD"}
                    </p>
                  </div>

                  {searchedOrder.trackingNumber && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Truck className="h-4 w-4" />
                        Tracking Number
                      </div>
                      <p className="text-sm text-gray-600 font-mono">{searchedOrder.trackingNumber}</p>
                    </div>
                  )}

                  {searchedOrder.shippingAddress && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <MapPin className="h-4 w-4" />
                        Shipping To
                      </div>
                      <p className="text-sm text-gray-600">{searchedOrder.shippingAddress}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </div>
                      <p className="text-sm text-gray-600">{searchedOrder.customer.email}</p>
                    </div>

                    {searchedOrder.customer.phone && (
                      <div>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <Phone className="h-4 w-4" />
                          Phone Number
                        </div>
                        <p className="text-sm text-gray-600">{searchedOrder.customer.phone}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Customer Name</div>
                      <p className="text-sm text-gray-600">{searchedOrder.customer.name}</p>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Order Total</div>
                      <p className="text-lg font-semibold text-gray-900">R{searchedOrder.amount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Order Items ({searchedOrder.items.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {searchedOrder.items.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex items-center gap-4 p-4 border rounded-lg">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span>Size: {item.size}</span>
                          <span>Qty: {item.quantity}</span>
                          <Badge variant="outline">R{item.price}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">R{(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Help Section */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>If you have any questions about your order, we're here to help.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Contact Support</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>support@infinitestoresa.co.za</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>+27 11 123 4567</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Business Hours</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p>Saturday: 9:00 AM - 2:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
