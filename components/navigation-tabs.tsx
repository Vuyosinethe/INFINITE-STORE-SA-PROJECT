import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Flame, Sparkles, ShoppingBag, Shirt, Users } from "lucide-react"

export function NavigationTabs() {
  const tabs = [
    { name: "New Releases", href: "/new-releases", icon: Sparkles, color: "bg-primary" },
    { name: "Hot Deals", href: "/hot-deals", icon: Flame, color: "bg-black" },
    { name: "Sneakers", href: "/sneakers", icon: ShoppingBag, color: "bg-primary" },
    { name: "Socks", href: "/socks", icon: Shirt, color: "bg-black" },
    { name: "Football Tees", href: "/football-tees", icon: Users, color: "bg-primary" },
  ]

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <Button
              key={tab.name}
              asChild
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg transition-all border-black hover:bg-primary/10 bg-transparent"
            >
              <Link href={tab.href}>
                <div className={`p-3 rounded-full ${tab.color} text-white`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="font-medium text-center">{tab.name}</span>
              </Link>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
