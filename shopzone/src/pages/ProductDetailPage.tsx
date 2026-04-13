import { useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import {
  Star, ShoppingCart, Heart, ArrowLeft,
  Truck, Shield, RefreshCw, Share2,
  Plus, Minus, Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import ProductCard from "@/components/ProductCard"
import { useProduct, useProducts } from "@/hooks/useProducts"

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { product, loading, error } = useProduct(id!)
  const { products: relatedProducts } = useProducts(8)

  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleAddToCart = () => {
    // Will connect to Cart Context in next steps
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    alert("Link copied to clipboard!")
  }

  // Filter related products (same category, excluding current)
  const related = relatedProducts
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4)

  // ── Loading State ──
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-gray-200 rounded-2xl h-96 animate-pulse" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 rounded animate-pulse w-1/2" />
            <div className="h-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-12 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  // ── Error State ──
  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-6xl mb-4">😕</p>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <Button onClick={() => navigate("/products")}>
          Back to Products
        </Button>
      </div>
    )
  }

  // ── Star Rating Helper ──
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : i < rating
            ? "fill-yellow-200 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-blue-600">Products</Link>
          <span>/</span>
          <Link
            to={`/products?category=${product.category}`}
            className="hover:text-blue-600 capitalize"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-800 line-clamp-1">{product.title}</span>
        </div>

        {/* ── Back Button ── */}
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* ── Main Product Section ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-2xl p-6 md:p-10 shadow-sm">

          {/* Left — Product Image */}
          <div className="flex flex-col gap-4">
            <div className="bg-gray-50 rounded-xl p-8 flex items-center justify-center h-96">
              <img
                src={product.image}
                alt={product.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            {/* Share Button */}
            <Button variant="outline" className="gap-2 w-full" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
              Share this product
            </Button>
          </div>

          {/* Right — Product Info */}
          <div className="flex flex-col gap-4">

            {/* Category & Badge */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="capitalize">
                {product.category}
              </Badge>
              {product.rating.count > 200 && (
                <Badge className="bg-orange-500 hover:bg-orange-600">
                  🔥 Popular
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {renderStars(product.rating.rate)}
              </div>
              <span className="font-semibold text-gray-700">
                {product.rating.rate}
              </span>
              <span className="text-gray-500 text-sm">
                ({product.rating.count} reviews)
              </span>
            </div>

            <Separator />

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-blue-600">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-lg text-gray-400 line-through">
                ${(product.price * 1.2).toFixed(2)}
              </span>
              <Badge className="bg-green-500 hover:bg-green-600">
                20% OFF
              </Badge>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed text-sm">
              {product.description}
            </p>

            <Separator />

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                className="flex-1 gap-2 h-12 text-base"
                onClick={handleAddToCart}
              >
                {addedToCart ? (
                  <>
                    <Check className="h-5 w-5" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`h-12 w-12 ${isWishlisted ? "text-red-500 border-red-300" : ""}`}
                onClick={handleWishlist}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500" : ""}`} />
              </Button>
            </div>

            {/* Buy Now Button */}
            <Button
              variant="outline"
              className="w-full h-12 text-base font-semibold"
              onClick={() => {
                handleAddToCart()
                navigate("/cart")
              }}
            >
              Buy Now
            </Button>

            <Separator />

            {/* Delivery Info */}
            <div className="grid grid-cols-1 gap-3">
              {[
                { icon: <Truck className="h-4 w-4 text-blue-600" />, text: "Free delivery on orders over $50" },
                { icon: <Shield className="h-4 w-4 text-green-600" />, text: "2 year warranty included" },
                { icon: <RefreshCw className="h-4 w-4 text-orange-600" />, text: "30 day free returns" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-sm text-gray-600">
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default ProductDetailPage