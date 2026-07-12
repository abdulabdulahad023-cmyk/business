export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  imageUrl: string;
  isDeal?: boolean;
  description?: string;
  category?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface WishlistItem extends Product {}
