import catElectronicsImg from '@assets/generated_images/cat-electronics.jpg';
import catFashionImg from '@assets/generated_images/cat-fashion.jpg';
import catHomeImg from '@assets/generated_images/cat-home.jpg';
import catBeautyImg from '@assets/generated_images/cat-beauty.jpg';

import productsData from '@/data/products.json';
import { Product } from '@/types';

export const CATEGORIES = [
  { id: 'electronics', name: 'Electronics & Audio', itemCount: 1240, imageUrl: catElectronicsImg },
  { id: 'fashion', name: 'Fashion & Apparel', itemCount: 3850, imageUrl: catFashionImg },
  { id: 'home', name: 'Home & Living', itemCount: 2100, imageUrl: catHomeImg },
  { id: 'beauty', name: 'Beauty & Wellness', itemCount: 950, imageUrl: catBeautyImg },
];

export const ALL_PRODUCTS = productsData as Product[];

export const FEATURED_PRODUCTS = ALL_PRODUCTS.filter(p => !p.isDeal).slice(0, 4);
export const DAILY_DEALS = ALL_PRODUCTS.filter(p => p.isDeal).slice(0, 4);

export const NAVBAR_MOCK_CATEGORIES = [
  {
    title: 'Electronics & Audio',
    href: '/products?category=Electronics+%26+Audio',
    image: catElectronicsImg,
    subcategories: [
      { name: 'Headphones & Earbuds', href: '/products?category=Electronics+%26+Audio&q=headphones' },
      { name: 'Smart Home Devices', href: '/products?category=Electronics+%26+Audio&q=smart' },
      { name: 'Mechanical Keyboards', href: '/products?category=Electronics+%26+Audio&q=keyboard' },
      { name: 'Desktop Accessories', href: '/products?category=Electronics+%26+Audio&q=mouse' },
    ]
  },
  {
    title: 'Fashion & Apparel',
    href: '/products?category=Fashion+%26+Apparel',
    image: catFashionImg,
    subcategories: [
      { name: 'Minimalist Watches', href: '/products?category=Fashion+%26+Apparel&q=watch' },
      { name: 'Everyday Basics', href: '/products?category=Fashion+%26+Apparel&q=bag' },
      { name: 'Outerwear', href: '/products?category=Fashion+%26+Apparel&q=scarf' },
      { name: 'Accessories', href: '/products?category=Fashion+%26+Apparel&q=glasses' },
    ]
  },
  {
    title: 'Home & Living',
    href: '/products?category=Home+%26+Living',
    image: catHomeImg,
    subcategories: [
      { name: 'Kitchen & Dining', href: '/products?category=Home+%26+Living&q=kitchen' },
      { name: 'Bedding & Bath', href: '/products?category=Home+%26+Living&q=towel' },
      { name: 'Decor & Lighting', href: '/products?category=Home+%26+Living&q=lamp' },
      { name: 'Furniture', href: '/products?category=Home+%26+Living&q=diffuser' },
    ]
  },
  {
    title: 'Beauty & Wellness',
    href: '/products?category=Beauty+%26+Wellness',
    image: catBeautyImg,
    subcategories: [
      { name: 'Skincare', href: '/products?category=Beauty+%26+Wellness&q=serum' },
      { name: 'Aromatherapy', href: '/products?category=Beauty+%26+Wellness&q=shower' },
      { name: 'Grooming Tools', href: '/products?category=Beauty+%26+Wellness&q=roller' },
      { name: 'Supplements', href: '/products?category=Beauty+%26+Wellness&q=matcha' },
    ]
  }
];

export const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'Order Shipped', description: 'Your order #1084 has been shipped and is on its way.', time: '2 hours ago', isUnread: true },
  { id: '2', title: 'Price Drop Alert', description: 'A product in your wishlist has dropped in price.', time: '5 hours ago', isUnread: true },
  { id: '3', title: 'Back in Stock', description: 'The MK-84 Mechanical Keyboard is back in stock.', time: '1 day ago', isUnread: false },
];
