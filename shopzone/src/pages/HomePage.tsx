import { Link } from "react-router-dom"
import { ArrowRight, ShoppingBag, Truck, Shield, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ProductCard from "@/components/ProductCard"
import { useProducts, useCategories } from "@/hooks/useProducts"

// Category Icons & Colors
const categoryStyles: Record<string, { color: string; emoji: string }> = {
  "electronics": { color: "bg-blue-100 text-blue-700", emoji: "💻" },
  "jewelery": { color: "bg-yellow-100 text-yellow-700", emoji: "💍" },
  "men's clothing": { color: "bg-green-100 text-green-700", emoji: "👔" },
  "women's clothing": { color: "bg-pink-100 text-pink-700", emoji: "👗" },
}

const HomePage = () => {
  const { products, loading: productsLoading } = useProducts(8)
  const { categories, loading: categoriesLoading } = useCategories()

  return (
    <div className="min-h-screen">

      {/* ── Hero Section ── */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
              Shop The Best <br />
              <span className="text-yellow-300">Deals Online</span>
            </h1>
            <p className="text-blue-100 text-lg mb-8 max-w-md">
              Discover thousands of products across all categories. Fast delivery, easy returns, best prices guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/products">
                <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Shop Now
                </Button>
              </Link>
              <Link to="/products">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 gap-2">
                  Browse Categories
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
          {/* Hero Image */}
          <div className="flex-1 flex justify-center">
            <div className="bg-white/10 rounded-2xl p-8 text-center">
              <div className="text-8xl mb-4">🛍️</div>
              <p className="text-blue-100 font-medium">10,000+ Products</p>
              <p className="text-blue-100 font-medium">Free Shipping over $50</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Bar ── */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Truck className="h-6 w-6 text-blue-600" />, title: "Free Shipping", desc: "On orders over $50" },
              { icon: <Shield className="h-6 w-6 text-blue-600" />, title: "Secure Payment", desc: "100% protected" },
              { icon: <ArrowRight className="h-6 w-6 text-blue-600" />, title: "Easy Returns", desc: "30 day policy" },
              { icon: <Headphones className="h-6 w-6 text-blue-600" />, title: "24/7 Support", desc: "Always here for you" },
            ].map((feature) => (
              <div key={feature.title} className="flex items-center gap-3 p-3">
                <div className="bg-blue-50 p-2 rounded-lg">{feature.icon}</div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">{feature.title}</p>
                  <p className="text-xs text-gray-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Shop by Category</h2>
          <Link to="/products">
            <Button variant="ghost" className="gap-1 text-blue-600">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {categoriesLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => {
              const style = categoryStyles[category] || {
                color: "bg-gray-100 text-gray-700",
                emoji: "🛒",
              }
              return (
                <Link key={category} to={`/products?category=${category}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="flex flex-col items-center justify-center p-6 gap-2">
                      <span className="text-3xl">{style.emoji}</span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${style.color}`}>
                        {category}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* ── Featured Products Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
          <Link to="/products">
            <Button variant="ghost" className="gap-1 text-blue-600">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ── Banner Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-2">
            🔥 Special Offer!
          </h2>
          <p className="text-white/90 mb-6 text-lg">
            Get 20% off on your first order. Use code: <strong>FIRST20</strong>
          </p>
          <Link to="/products">
            <Button size="lg" className="bg-white text-orange-500 hover:bg-gray-100 font-bold">
              Grab The Deal
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-800 text-gray-300 py-10 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-3">ShopZone</h3>
              <p className="text-sm">Your one-stop shop for everything you need.</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-3">Quick Links</h3>
              <ul className="text-sm space-y-2">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/products" className="hover:text-white">Products</Link></li>
                <li><Link to="/cart" className="hover:text-white">Cart</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-3">Account</h3>
              <ul className="text-sm space-y-2">
                <li><Link to="/login" className="hover:text-white">Login</Link></li>
                <li><Link to="/register" className="hover:text-white">Register</Link></li>
                <li><Link to="/wishlist" className="hover:text-white">Wishlist</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-3">Support</h3>
              <ul className="text-sm space-y-2">
                <li><span className="hover:text-white cursor-pointer">FAQ</span></li>
                <li><span className="hover:text-white cursor-pointer">Contact Us</span></li>
                <li><span className="hover:text-white cursor-pointer">Returns</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 text-center text-sm">
            <p>© 2026 ShopZone. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default HomePage