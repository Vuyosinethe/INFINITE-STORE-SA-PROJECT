import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">About iNfinite store.SA</h1>
          <p className="text-xl text-muted-foreground">
            Your ultimate destination for premium sportswear in South Africa
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              At iNfinite store.SA, we believe that everyone deserves access to high-quality sportswear that combines
              style, comfort, and performance. We're passionate about bringing you the latest trends in sneakers, socks,
              and football apparel.
            </p>
            <p className="text-muted-foreground">
              Founded with the vision of making premium sportswear accessible to all South Africans, we've built our
              reputation on quality products, competitive prices, and exceptional customer service.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-muted-foreground mb-4">
              What started as a small passion project has grown into South Africa's trusted online destination for
              sportswear. We carefully curate our collection to ensure every product meets our high standards for
              quality and style.
            </p>
            <p className="text-muted-foreground">
              From the latest sneaker drops to essential football gear, we're here to help you express your unique style
              while staying comfortable and confident.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <MapPin className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Location</h3>
              <p className="text-sm text-muted-foreground">
                Cape Town, South Africa
                <br />
                Nationwide Delivery
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Phone className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Phone</h3>
              <p className="text-sm text-muted-foreground">
                +27 (0) 21 123 4567
                <br />
                WhatsApp Available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Mail className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-sm text-muted-foreground">
                info@infinitestore.co.za
                <br />
                support@infinitestore.co.za
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Hours</h3>
              <p className="text-sm text-muted-foreground">
                Mon-Fri: 9AM-6PM
                <br />
                Sat: 9AM-4PM
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-muted rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Get In Touch</h2>
          <p className="text-muted-foreground mb-4">
            Have questions about our products or need help with your order? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+27211234567"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Call Us Now
            </a>
            <a
              href="mailto:info@infinitestore.co.za"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Send Email
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
