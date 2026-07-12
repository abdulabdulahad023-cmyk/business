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
  images?: string[];
  colors?: { name: string; hex: string; imageIndex?: number }[];
  sizes?: { name: string; inStock: boolean }[];
  specifications?: { label: string; value: string }[];
  seller?: { name: string; rating: number; sales: number; joinedDate?: string };
  reviewList?: { id: string; author: string; rating: number; date: string; title: string; body: string; verified: boolean; helpfulCount: number }[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface WishlistItem extends Product {}
