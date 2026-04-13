import { Link } from "react-router-dom"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Product } from "@/types"

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 flex flex-col">
      {/* Product Image */}
      <Link to={`/products/${product.id}`}>
        <div className="relative overflow-hidden rounded-t-lg bg-white p-4 h-56 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
          {/* Wishlist Button */}
          <button className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500">
            <Heart className="h-4 w-4" />
          </button>
        </div>
      </Link>

      <CardContent className="flex-1 p-4">
        {/* Category Badge */}
        <Badge variant="secondary" className="mb-2 text-xs capitalize">
          {product.category}
        </Badge>

        {/* Title */}
        <Link to={`/products/${product.id}`}>
          <h3 className="font-medium text-sm text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors mb-2">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs text-gray-600">
            {product.rating.rate} ({product.rating.count})
          </span>
        </div>

        {/* Price */}
        <p className="text-lg font-bold text-blue-600">
          ${product.price.toFixed(2)}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full gap-2" size="sm">
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ProductCard