import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { SlidersHorizontal, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ProductCard from "@/components/ProductCard"
import { useProductsByCategory } from "@/hooks/useProducts"
import { useCategories } from "@/hooks/useProducts"

type SortOption = "default" | "price-low" | "price-high" | "rating" | "name"

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  // Read from URL params
  const urlCategory = searchParams.get("category") || "all"
  const urlSearch = searchParams.get("search") || ""

  const [selectedCategory, setSelectedCategory] = useState(urlCategory)
  const [searchQuery, setSearchQuery] = useState(urlSearch)
  const [searchInput, setSearchInput] = useState(urlSearch)
  const [sortBy, setSortBy] = useState<SortOption>("default")
  const [showFilters, setShowFilters] = useState(false)

  const { products, loading, error } = useProductsByCategory(selectedCategory)
  const { categories } = useCategories()

  // Sync URL params when category changes
  useEffect(() => {
    const params: Record<string, string> = {}
    if (selectedCategory !== "all") params.category = selectedCategory
    if (searchQuery) params.search = searchQuery
    setSearchParams(params)
  }, [selectedCategory, searchQuery])

  // Sync state when URL changes (e.g. clicking category on Home Page)
  useEffect(() => {
    setSelectedCategory(urlCategory)
    setSearchQuery(urlSearch)
    setSearchInput(urlSearch)
  }, [urlCategory, urlSearch])

  // Filter & Sort products
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Search filter
    if (searchQuery) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "rating":
        result.sort((a, b) => b.rating.rate - a.rating.rate)
        break
      case "name":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      default:
        break
    }

    return result
  }, [products, searchQuery, sortBy])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(searchInput)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setSearchInput("")
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setShowFilters(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ── Page Header ── */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {selectedCategory === "all"
            ? "All Products"
            : <span className="capitalize">{selectedCategory}</span>}
        </h1>
        <p className="text-gray-500 mt-1">
          {loading ? "Loading..." : `${filteredProducts.length} products found`}
        </p>
      </div>

      {/* ── Search & Sort Bar ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button type="submit">Search</Button>
        </form>

        {/* Sort */}
        <Select value={sortBy} onValueChange={(val) => setSortBy(val as SortOption)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Top Rated</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
          </SelectContent>
        </Select>

        {/* Mobile Filter Toggle */}
        <Button
          variant="outline"
          className="sm:hidden gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>

      </div>

      <div className="flex gap-6">

        {/* ── Sidebar Filters (Desktop) ── */}
        <aside className="hidden sm:block w-48 shrink-0">
          <div className="bg-white rounded-xl border p-4 sticky top-24">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Categories
            </h3>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => handleCategorySelect("all")}
                className={`text-left text-sm px-3 py-2 rounded-lg transition-colors capitalize ${
                  selectedCategory === "all"
                    ? "bg-blue-600 text-white font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`text-left text-sm px-3 py-2 rounded-lg transition-colors capitalize ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Mobile Filter Dropdown ── */}
        {showFilters && (
          <div className="sm:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setShowFilters(false)}>
            <div
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-semibold text-gray-800 mb-4">Categories</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategorySelect("all")}
                  className={`text-sm px-4 py-2 rounded-full border transition-colors ${
                    selectedCategory === "all"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "text-gray-600 border-gray-300"
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={`text-sm px-4 py-2 rounded-full border transition-colors capitalize ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white border-blue-600"
                        : "text-gray-600 border-gray-300"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Products Grid ── */}
        <div className="flex-1">

          {/* Active Filters */}
          {(selectedCategory !== "all" || searchQuery) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="gap-1 capitalize">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory("all")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Search: {searchQuery}
                  <button onClick={handleClearSearch}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg">{error}</p>
              <Button className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-6xl mb-4">🔍</p>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 mb-6">
                Try a different search or category
              </p>
              <Button onClick={() => {
                setSelectedCategory("all")
                handleClearSearch()
              }}>
                Clear Filters
              </Button>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && filteredProducts.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default ProductsPage