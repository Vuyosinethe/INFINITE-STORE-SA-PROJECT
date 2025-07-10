import Link from "next/link"
import { MapPin, Phone, Mail, MessageCircle, Instagram, Package } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              <span className="text-black">i</span>
              <span className="text-orange-500">Nfinite</span>
              <span className="text-black"> store.SA</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              Your ultimate destination for premium sneakers, socks, and football tees in South Africa.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/infinite_store20?igsh=MTZlbHc5ZXhvOW4wbA%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium"
              >
                <Instagram className="h-5 w-5" />
                <span className="text-sm">@infinite_store20</span>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <Link href="/new-releases" className="block text-muted-foreground hover:text-foreground">
                New Releases
              </Link>
              <Link href="/hot-deals" className="block text-muted-foreground hover:text-foreground">
                Hot Deals
              </Link>
              <Link href="/sneakers" className="block text-muted-foreground hover:text-foreground">
                Sneakers
              </Link>
              <Link href="/about" className="block text-muted-foreground hover:text-foreground">
                About Us
              </Link>
              <Link href="/track-order" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <Package className="h-4 w-4" />
                Track Your Order
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Categories</h4>
            <div className="space-y-2 text-sm">
              <Link href="/sneakers" className="block text-muted-foreground hover:text-foreground">
                Sneakers
              </Link>
              <Link href="/socks" className="block text-muted-foreground hover:text-foreground">
                Socks
              </Link>
              <Link href="/football-tees" className="block text-muted-foreground hover:text-foreground">
                Football Tees
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Contact Info</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Cape Town, South Africa</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+27 (0) 21 123 4567</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@infinitestore.co.za</span>
              </div>
              <a
                href="https://wa.me/27737624156"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp: +27 73 762 4156</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} iNfinite store.SA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
