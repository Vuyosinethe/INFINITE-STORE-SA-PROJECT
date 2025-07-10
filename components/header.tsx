"use client"

import Link from "next/link"
import { ShoppingCart, Menu, MessageCircle, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/cart-provider"
import { CartSheet } from "@/components/cart-sheet"
import { SearchBar } from "@/components/search-bar"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Header() {
  const { items } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const navigation = [
    { name: "Home", href: "/" },
    { name: "New Releases", href: "/new-releases" },
    { name: "Hot Deals", href: "/hot-deals" },
    { name: "About Us", href: "/about" },
  ]

  const productCategories = [
    { name: "Sneakers", href: "/sneakers", icon: "👟" },
    { name: "Socks", href: "/socks", icon: "🧦" },
    { name: "Football Tees", href: "/football-tees", icon: "⚽" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">
              <span className="text-black">i</span>
              <span className="text-orange-500">Nfinite</span>
              <span className="text-black"> store.SA</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-orange-500"
              >
                {item.name}
              </Link>
            ))}

            {/* Products Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-sm font-medium transition-colors hover:text-orange-500 flex items-center gap-1"
                >
                  Products
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {productCategories.map((category) => (
                  <DropdownMenuItem key={category.name} asChild>
                    <Link href={category.href} className="flex items-center gap-2 w-full">
                      <span>{category.icon}</span>
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-[280px] mx-4">
            <SearchBar />
          </div>

          <div className="flex items-center space-x-6">
            {/* WhatsApp Help Button */}
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 bg-transparent"
            >
              <a
                href="https://wa.me/27737624156"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Help</span>
              </a>
            </Button>

            {/* Cart Button */}
            <Button
              variant="outline"
              size="sm"
              className="relative border-black hover:bg-orange-500 hover:text-black bg-transparent"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-orange-500 text-black"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden bg-transparent">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {/* Mobile Search */}
                  <div className="pb-4 border-b">
                    <SearchBar placeholder="Search products..." />
                  </div>

                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium transition-colors hover:text-orange-500"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}

                  {/* Mobile Products Section */}
                  <div className="pt-2 border-t">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Products</h3>
                    {productCategories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="flex items-center gap-2 text-lg font-medium transition-colors hover:text-orange-500 py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span>{category.icon}</span>
                        {category.name}
                      </Link>
                    ))}
                  </div>

                  <div className="pt-4 border-t">
                    <a
                      href="https://wa.me/27737624156"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-lg font-medium text-green-600 hover:text-green-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <MessageCircle className="h-5 w-5" />
                      WhatsApp Help
                    </a>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
    </header>
  )
}
