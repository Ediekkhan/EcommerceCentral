import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import ProductFilters from "@/components/product-filters";
import ProductCard from "@/components/product-card";
import CartDrawer from "@/components/cart-drawer";
import { cartManager } from "@/lib/cart";
import type { Product } from "@shared/schema";
import type { CartState } from "@/lib/cart";

export default function Home() {
  const [cartState, setCartState] = useState<CartState>(() => cartManager.getCart());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const { toast } = useToast();

  // Subscribe to cart changes
  useEffect(() => {
    const unsubscribe = cartManager.subscribe(setCartState);
    return unsubscribe;
  }, []);

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (searchQuery) queryParams.append("search", searchQuery);
  if (category && category !== "All Categories") queryParams.append("category", category);
  
  // Parse price range
  if (priceRange !== "all") {
    if (priceRange === "0-50") {
      queryParams.append("minPrice", "0");
      queryParams.append("maxPrice", "50");
    } else if (priceRange === "50-100") {
      queryParams.append("minPrice", "50");
      queryParams.append("maxPrice", "100");
    } else if (priceRange === "100-200") {
      queryParams.append("minPrice", "100");
      queryParams.append("maxPrice", "200");
    } else if (priceRange === "200+") {
      queryParams.append("minPrice", "200");
    }
  }

  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products", queryParams.toString()],
    queryFn: async () => {
      const response = await fetch(`/api/products?${queryParams.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-desc":
        return parseFloat(b.price) - parseFloat(a.price);
      case "rating":
        return parseFloat(b.rating) - parseFloat(a.rating);
      case "popular":
        return b.reviewCount - a.reviewCount;
      default:
        return 0;
    }
  });

  const handleAddToCart = (product: Product) => {
    cartManager.addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    cartManager.updateItemQuantity(id, quantity);
  };

  const handleRemoveItem = (id: number) => {
    cartManager.removeItem(id);
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Products</h2>
            <p className="text-gray-600">Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onCartOpen={() => setIsCartOpen(true)}
        cartItemCount={cartState.itemCount}
        onSearch={handleSearch}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Discover Amazing Products</h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Shop from thousands of verified sellers worldwide
            </p>
            <Button
              className="bg-white text-primary px-8 py-3 hover:bg-gray-100 font-semibold"
              onClick={() => {
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Shop Now
            </Button>
          </div>
        </div>
      </section>

      {/* Filters */}
      <ProductFilters
        category={category}
        priceRange={priceRange}
        sortBy={sortBy}
        onCategoryChange={setCategory}
        onPriceRangeChange={setPriceRange}
        onSortByChange={setSortBy}
        productCount={sortedProducts.length}
      />

      {/* Products */}
      <main id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartState.items}
        total={cartState.total}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ShopFlow</h3>
              <p className="text-gray-400 mb-4">
                Your trusted e-commerce platform for quality products worldwide.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">All Products</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Electronics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Fashion</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Home & Garden</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
              <p className="text-gray-400 mb-4">Subscribe for updates and special offers.</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ShopFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
