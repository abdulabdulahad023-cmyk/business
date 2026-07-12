import catElectronicsImg from '@assets/generated_images/cat-electronics.jpg';
import catFashionImg from '@assets/generated_images/cat-fashion.jpg';
import catHomeImg from '@assets/generated_images/cat-home.jpg';
import catBeautyImg from '@assets/generated_images/cat-beauty.jpg';
import prodKeyboardImg from '@assets/generated_images/prod-keyboard.jpg';
import prodWatchImg from '@assets/generated_images/prod-watch.jpg';
import prodSpeakerImg from '@assets/generated_images/prod-speaker.jpg';
import prodPotImg from '@assets/generated_images/prod-pot.jpg';
import dealEarbudsImg from '@assets/generated_images/deal-earbuds.jpg';

export const CATEGORIES = [
  { id: 'electronics', name: 'Electronics & Audio', itemCount: 1240, imageUrl: catElectronicsImg },
  { id: 'fashion', name: 'Fashion & Apparel', itemCount: 3850, imageUrl: catFashionImg },
  { id: 'home', name: 'Home & Living', itemCount: 2100, imageUrl: catHomeImg },
  { id: 'beauty', name: 'Beauty & Wellness', itemCount: 950, imageUrl: catBeautyImg },
];

export const FEATURED_PRODUCTS = [
  { id: 'p1', brand: 'Kepler', name: 'MK-84 Mechanical Keyboard with Custom Matte Keycaps', price: 185.00, rating: 4.8, reviews: 124, imageUrl: prodKeyboardImg },
  { id: 'p2', brand: 'Achron', name: 'Chronos Minimalist Wristwatch with Leather Strap', price: 245.00, rating: 4.9, reviews: 89, imageUrl: prodWatchImg },
  { id: 'p3', brand: 'Vou', name: 'Brutalist Concrete Portable Wireless Speaker', price: 320.00, rating: 4.7, reviews: 210, imageUrl: prodSpeakerImg },
  { id: 'p4', brand: 'Culinary Co.', name: 'Artisan Matte Cast Iron Dutch Oven (5.5 Qt)', price: 165.00, rating: 4.9, reviews: 452, imageUrl: prodPotImg },
];

export const DAILY_DEALS = [
  { id: 'd1', brand: 'Sonic', name: 'Zenith Noise-Cancelling Wireless Earbuds', price: 129.99, originalPrice: 199.99, rating: 4.6, reviews: 830, imageUrl: dealEarbudsImg, isDeal: true },
  { id: 'd2', brand: 'Lumina', name: 'Smart Ambient Table Lamp with App Control', price: 45.00, originalPrice: 85.00, rating: 4.5, reviews: 112, imageUrl: catElectronicsImg, isDeal: true },
  { id: 'd3', brand: 'Essential', name: 'Premium Cotton Percale Sheet Set - Queen', price: 89.00, originalPrice: 150.00, rating: 4.8, reviews: 620, imageUrl: catHomeImg, isDeal: true },
  { id: 'd4', brand: 'Aura', name: 'Hydrating Botanical Serum with Hyaluronic Acid', price: 32.00, originalPrice: 65.00, rating: 4.7, reviews: 345, imageUrl: catBeautyImg, isDeal: true },
];

export const ALL_PRODUCTS = [...FEATURED_PRODUCTS, ...DAILY_DEALS];

export const NAVBAR_MOCK_CATEGORIES = [
  {
    title: 'Electronics & Audio',
    href: '/category/electronics',
    image: catElectronicsImg,
    subcategories: [
      { name: 'Headphones & Earbuds', href: '/category/electronics/headphones' },
      { name: 'Smart Home Devices', href: '/category/electronics/smart-home' },
      { name: 'Mechanical Keyboards', href: '/category/electronics/keyboards' },
      { name: 'Desktop Accessories', href: '/category/electronics/desktop' },
    ]
  },
  {
    title: 'Fashion & Apparel',
    href: '/category/fashion',
    image: catFashionImg,
    subcategories: [
      { name: 'Minimalist Watches', href: '/category/fashion/watches' },
      { name: 'Everyday Basics', href: '/category/fashion/basics' },
      { name: 'Outerwear', href: '/category/fashion/outerwear' },
      { name: 'Leather Goods', href: '/category/fashion/leather' },
    ]
  },
  {
    title: 'Home & Living',
    href: '/category/home',
    image: catHomeImg,
    subcategories: [
      { name: 'Kitchen & Dining', href: '/category/home/kitchen' },
      { name: 'Bedding & Bath', href: '/category/home/bedding' },
      { name: 'Decor & Lighting', href: '/category/home/decor' },
      { name: 'Furniture', href: '/category/home/furniture' },
    ]
  },
  {
    title: 'Beauty & Wellness',
    href: '/category/beauty',
    image: catBeautyImg,
    subcategories: [
      { name: 'Skincare', href: '/category/beauty/skincare' },
      { name: 'Fragrance', href: '/category/beauty/fragrance' },
      { name: 'Grooming Tools', href: '/category/beauty/grooming' },
      { name: 'Supplements', href: '/category/beauty/supplements' },
    ]
  }
];

export const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'Order Shipped', description: 'Your order #1084 has been shipped and is on its way.', time: '2 hours ago', isUnread: true },
  { id: '2', title: 'Price Drop Alert', description: 'A product in your wishlist has dropped in price.', time: '5 hours ago', isUnread: true },
  { id: '3', title: 'Back in Stock', description: 'The MK-84 Mechanical Keyboard is back in stock.', time: '1 day ago', isUnread: false },
];
