import { products, cartItems, orders, type Product, type InsertProduct, type CartItem, type InsertCartItem, type Order, type InsertOrder } from "@shared/schema";

export interface IStorage {
  // Products
  getProducts(filters?: { category?: string; minPrice?: number; maxPrice?: number; search?: string }): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  
  // Cart (using localStorage on frontend, these are for potential server-side cart)
  getCartItems(): Promise<CartItem[]>;
  addCartItem(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: number): Promise<void>;
  clearCart(): Promise<void>;
  
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private currentProductId: number;
  private currentCartItemId: number;
  private currentOrderId: number;

  constructor() {
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.currentProductId = 1;
    this.currentCartItemId = 1;
    this.currentOrderId = 1;
    
    // Initialize with sample products matching the design
    this.initializeProducts();
  }

  private initializeProducts() {
    const sampleProducts: Product[] = [
      {
        id: 1,
        name: "Premium Wireless Headphones",
        description: "High-quality sound with noise cancellation",
        price: "199.99",
        originalPrice: "249.99",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        category: "Electronics",
        rating: "5.0",
        reviewCount: 124,
        badge: "Best Seller",
        inStock: true,
      },
      {
        id: 2,
        name: "Smart Fitness Watch",
        description: "Track your health and fitness goals",
        price: "299.99",
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        category: "Electronics",
        rating: "4.2",
        reviewCount: 89,
        badge: null,
        inStock: true,
      },
      {
        id: 3,
        name: "Ultra-thin Laptop",
        description: "Powerful performance in a sleek design",
        price: "899.99",
        originalPrice: "1099.99",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        category: "Electronics",
        rating: "4.8",
        reviewCount: 256,
        badge: "20% OFF",
        inStock: true,
      },
      {
        id: 4,
        name: "Latest Smartphone",
        description: "Advanced camera and lightning-fast performance",
        price: "799.99",
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        category: "Electronics",
        rating: "4.1",
        reviewCount: 342,
        badge: null,
        inStock: true,
      },
      {
        id: 5,
        name: "Designer Jacket",
        description: "Premium quality materials and craftsmanship",
        price: "149.99",
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        category: "Fashion",
        rating: "4.7",
        reviewCount: 76,
        badge: "New",
        inStock: true,
      },
      {
        id: 6,
        name: "Modern Plant Pot",
        description: "Elevate your home with stylish decor",
        price: "39.99",
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        category: "Home & Garden",
        rating: "4.3",
        reviewCount: 45,
        badge: null,
        inStock: true,
      },
      {
        id: 7,
        name: "Fitness Equipment Set",
        description: "Complete workout solution for home",
        price: "199.99",
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        category: "Sports",
        rating: "4.9",
        reviewCount: 112,
        badge: null,
        inStock: true,
      },
      {
        id: 8,
        name: "Coffee Maker Pro",
        description: "Brew the perfect cup every time",
        price: "129.99",
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        category: "Home & Garden",
        rating: "4.4",
        reviewCount: 93,
        badge: null,
        inStock: true,
      },
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
      this.currentProductId = Math.max(this.currentProductId, product.id + 1);
    });
  }

  async getProducts(filters?: { category?: string; minPrice?: number; maxPrice?: number; search?: string }): Promise<Product[]> {
    let results = Array.from(this.products.values());

    if (filters) {
      if (filters.category && filters.category !== "All Categories") {
        results = results.filter(p => p.category === filters.category);
      }
      
      if (filters.minPrice !== undefined) {
        results = results.filter(p => parseFloat(p.price) >= filters.minPrice!);
      }
      
      if (filters.maxPrice !== undefined) {
        results = results.filter(p => parseFloat(p.price) <= filters.maxPrice!);
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        results = results.filter(p => 
          p.name.toLowerCase().includes(searchLower) || 
          p.description.toLowerCase().includes(searchLower)
        );
      }
    }

    return results;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getCartItems(): Promise<CartItem[]> {
    return Array.from(this.cartItems.values());
  }

  async addCartItem(insertItem: InsertCartItem): Promise<CartItem> {
    const id = this.currentCartItemId++;
    const item: CartItem = { ...insertItem, id };
    this.cartItems.set(id, item);
    return item;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (item) {
      item.quantity = quantity;
      this.cartItems.set(id, item);
      return item;
    }
    return undefined;
  }

  async removeCartItem(id: number): Promise<void> {
    this.cartItems.delete(id);
  }

  async clearCart(): Promise<void> {
    this.cartItems.clear();
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = { 
      ...insertOrder, 
      id,
      status: insertOrder.status || "pending",
      customerPhone: insertOrder.customerPhone || null,
      stripePaymentIntentId: insertOrder.stripePaymentIntentId || null,
      createdAt: new Date().toISOString()
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      order.status = status;
      this.orders.set(id, order);
      return order;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
