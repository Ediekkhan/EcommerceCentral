import type { Product } from "@shared/schema";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

const CART_STORAGE_KEY = 'shopflow-cart';

export class CartManager {
  private listeners: Array<(cart: CartState) => void> = [];

  getCart(): CartState {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const items = JSON.parse(stored) as CartItem[];
        return this.calculateCartState(items);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
    return { items: [], total: 0, itemCount: 0 };
  }

  private calculateCartState(items: CartItem[]): CartState {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return { items, total, itemCount };
  }

  private saveCart(items: CartItem[]): void {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      this.notifyListeners();
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }

  addItem(product: Product, quantity: number = 1): void {
    const cart = this.getCart();
    const existingItem = cart.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.image,
        quantity,
      });
    }
    
    this.saveCart(cart.items);
  }

  updateItemQuantity(id: number, quantity: number): void {
    const cart = this.getCart();
    const item = cart.items.find(item => item.id === id);
    
    if (item) {
      if (quantity <= 0) {
        this.removeItem(id);
      } else {
        item.quantity = quantity;
        this.saveCart(cart.items);
      }
    }
  }

  removeItem(id: number): void {
    const cart = this.getCart();
    const filteredItems = cart.items.filter(item => item.id !== id);
    this.saveCart(filteredItems);
  }

  clearCart(): void {
    this.saveCart([]);
  }

  subscribe(listener: (cart: CartState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    const cart = this.getCart();
    this.listeners.forEach(listener => listener(cart));
  }
}

export const cartManager = new CartManager();
