import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '@/types';

export interface Coupon {
  code: string;
  discountPercent?: number; // e.g. 10 for 10%
  freeShipping?: boolean;
}

export const VALID_COUPONS: Record<string, Coupon> = {
  'WELCOME10': { code: 'WELCOME10', discountPercent: 10 },
  'SAVE20': { code: 'SAVE20', discountPercent: 20 },
  'FREESHIP': { code: 'FREESHIP', freeShipping: true },
};

interface CartState {
  items: CartItem[];
  savedForLater: Product[];
  coupon: Coupon | null;
  
  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  moveToSavedForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  removeFromSaved: (productId: string) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      savedForLater: [],
      coupon: null,

      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity }] };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity < 1) return;
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      moveToSavedForLater: (productId: string) => {
        set((state) => {
          const itemToMove = state.items.find((item) => item.id === productId);
          if (!itemToMove) return state;
          
          // Check if already in saved for later
          const alreadySaved = state.savedForLater.some((p) => p.id === productId);
          
          return {
            items: state.items.filter((item) => item.id !== productId),
            savedForLater: alreadySaved 
              ? state.savedForLater 
              : [...state.savedForLater, itemToMove], // We strip quantity by casting to Product, but since CartItem extends Product it's fine
          };
        });
      },

      moveToCart: (productId: string) => {
        set((state) => {
          const itemToMove = state.savedForLater.find((item) => item.id === productId);
          if (!itemToMove) return state;
          
          const existingInCart = state.items.find((item) => item.id === productId);
          
          return {
            savedForLater: state.savedForLater.filter((item) => item.id !== productId),
            items: existingInCart
              ? state.items.map((item) =>
                  item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
                )
              : [...state.items, { ...itemToMove, quantity: 1 }],
          };
        });
      },

      removeFromSaved: (productId: string) => {
        set((state) => ({
          savedForLater: state.savedForLater.filter((item) => item.id !== productId),
        }));
      },

      applyCoupon: (code: string) => {
        const normalizedCode = code.trim().toUpperCase();
        const validCoupon = VALID_COUPONS[normalizedCode];
        
        if (validCoupon) {
          set({ coupon: validCoupon });
          return { success: true, message: `Coupon ${normalizedCode} applied successfully!` };
        }
        
        return { success: false, message: 'Invalid or expired coupon code.' };
      },

      removeCoupon: () => {
        set({ coupon: null });
      },

      clearCart: () => {
        set({ items: [], coupon: null });
      },
    }),
    {
      name: 'marketsphere-cart',
    }
  )
);

// Selectors
export const useCartTotals = () => {
  const items = useCartStore((state) => state.items);
  const coupon = useCartStore((state) => state.coupon);
  
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  let discountAmount = 0;
  if (coupon?.discountPercent) {
    discountAmount = subtotal * (coupon.discountPercent / 100);
  }
  
  const FREE_SHIPPING_THRESHOLD = 75;
  const FLAT_SHIPPING_RATE = 12.50;
  
  const subtotalAfterDiscount = subtotal - discountAmount;
  
  let shippingCost = FLAT_SHIPPING_RATE;
  if (coupon?.freeShipping || subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD || itemCount === 0) {
    shippingCost = 0;
  }
  
  const progressToFreeShipping = Math.min(100, Math.max(0, (subtotalAfterDiscount / FREE_SHIPPING_THRESHOLD) * 100));
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotalAfterDiscount);
  
  const taxRate = 0.08; // 8% mock tax
  const estimatedTax = subtotalAfterDiscount * taxRate;
  
  const total = subtotalAfterDiscount + shippingCost + estimatedTax;

  return {
    itemCount,
    subtotal,
    discountAmount,
    shippingCost,
    estimatedTax,
    total,
    progressToFreeShipping,
    amountToFreeShipping,
    FREE_SHIPPING_THRESHOLD,
  };
};
