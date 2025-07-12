import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const handleAddToCart = () => {
    onAddToCart(product);
  };

  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-white shadow-md hover:bg-gray-50"
          >
            <Heart className="h-4 w-4 text-gray-400 hover:text-red-500" />
          </Button>
        </div>
        {product.badge && (
          <Badge
            className={`absolute top-4 left-4 ${
              product.badge === "Best Seller"
                ? "bg-accent text-white"
                : product.badge === "New"
                ? "bg-accent text-white"
                : product.badge.includes("OFF")
                ? "bg-red-500 text-white"
                : "bg-primary text-white"
            }`}
          >
            {product.badge}
          </Badge>
        )}
      </div>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <div className="flex items-center">
            <div className="flex text-yellow-400 text-sm">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(parseFloat(product.rating))
                      ? "fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-500 text-sm ml-2">({product.reviewCount})</span>
          </div>
        </div>
        <Button
          className="w-full bg-primary hover:bg-blue-600 text-white"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}
