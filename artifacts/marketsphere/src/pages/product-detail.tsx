import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, ShoppingBag, Star, StarHalf, ShieldCheck, 
  Truck, ArrowRight, Minus, Plus, Share2, MapPin, CheckCircle2, ChevronRight, Store
} from 'lucide-react';

import { Product } from '@/types';
import { ALL_PRODUCTS } from '@/lib/mock-data';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useToast } from '@/hooks/use-toast';

function StarRating({ rating, count }: { rating: number; count?: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1 text-primary">
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-current" />
        ))}
        {hasHalfStar && <StarHalf key="half" className="w-4 h-4 fill-current" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-muted-foreground/30" />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-sm font-medium text-foreground ml-1">
          {rating.toFixed(1)} <span className="text-muted-foreground font-normal">({count})</span>
        </span>
      )}
    </div>
  );
}

export function ProductDetail({ 
  id,
  onAddToCart,
  onToggleWishlist 
}: { 
  id: string;
  onAddToCart: (p: Product) => void;
  onToggleWishlist: (p: Product, isAdded: boolean) => void;
}) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const product = useMemo(() => ALL_PRODUCTS.find(p => p.id === id), [id]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-3xl font-display font-bold mb-4">Product Not Found</h1>
        <Button onClick={() => setLocation('/products')}>Back to Products</Button>
      </div>
    );
  }

  // Auto-generate missing mock data
  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl, product.imageUrl];
  const colors = product.colors || [
    { name: 'Default', hex: '#4B5563', imageIndex: 0 },
  ];
  const sizes = product.sizes || [
    { name: 'S', inStock: true },
    { name: 'M', inStock: true },
    { name: 'L', inStock: false },
    { name: 'XL', inStock: true },
  ];
  const specifications = product.specifications || [
    { label: 'Brand', value: product.brand },
    { label: 'Category', value: product.category || 'General' },
    { label: 'SKU', value: `MS-${product.id.toUpperCase()}-${Math.floor(Math.random()*10000)}` },
    { label: 'Weight', value: '1.2 lbs' },
    { label: 'Dimensions', value: '10 x 8 x 4 in' }
  ];
  const seller = product.seller || {
    name: `${product.brand} Official Store`,
    rating: 4.8,
    sales: Math.floor(Math.random() * 5000) + 500,
    joinedDate: '2021'
  };
  const reviews = product.reviewList || [
    { id: 'r1', author: 'Jane D.', rating: 5, date: '1 month ago', title: 'Excellent quality', body: 'Really impressed with the quality and design. Would highly recommend to anyone on the fence!', verified: true, helpfulCount: 12 },
    { id: 'r2', author: 'Mark S.', rating: 4, date: '2 months ago', title: 'Good but pricey', body: 'Very solid product. I subtracted one star because I feel it is slightly overpriced, but overall very happy with my purchase.', verified: true, helpfulCount: 4 },
    { id: 'r3', author: 'Alex W.', rating: 5, date: '3 months ago', title: 'Exceeded expectations', body: 'Looks even better in person. The packaging was beautiful and the item itself feels incredibly premium.', verified: true, helpfulCount: 8 }
  ];

  // State
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState(sizes.find(s => s.inStock)?.name || sizes[0].name);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Zoom state
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  // Delivery
  const [zip, setZip] = useState('');
  const [deliveryMsg, setDeliveryMsg] = useState('Free shipping, arrives in 3-5 business days');

  // Related & Bundle
  const relatedProducts = useMemo(() => 
    ALL_PRODUCTS.filter(p => p.id !== product.id && p.category === product.category).slice(0, 8),
  [product]);
  
  const bundleProducts = useMemo(() => 
    ALL_PRODUCTS.filter(p => p.id !== product.id).slice(0, 2),
  [product]);
  const bundleTotal = product.price + bundleProducts.reduce((sum, p) => sum + p.price, 0);

  // Handlers
  const handleColorChange = (color: typeof colors[0]) => {
    setSelectedColor(color);
    if (color.imageIndex !== undefined && images[color.imageIndex]) {
      setActiveImageIdx(color.imageIndex);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomPos({ x, y });
  };

  const handleCheckZip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zip.trim()) return;
    setDeliveryMsg(`Delivery to ${zip} by ${new Date(Date.now() + 3*24*60*60*1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`);
  };

  const handleAddToCart = () => {
    // In a real app we'd pass size/color
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
    toast({
      title: "Added to Cart",
      description: `${quantity}x ${product.name} (${selectedColor.name}, ${selectedSize})`,
    });
  };

  const handleToggleWishlist = () => {
    const newValue = !isWishlisted;
    setIsWishlisted(newValue);
    onToggleWishlist(product, newValue);
    if (newValue) {
      toast({ title: "Saved to Wishlist" });
    }
  };

  const handleAddBundle = () => {
    onAddToCart(product);
    bundleProducts.forEach(p => onAddToCart(p));
    toast({
      title: "Bundle Added",
      description: "All 3 items have been added to your cart.",
    });
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : null;

  return (
    <div className="w-full flex-1 flex flex-col bg-background pb-20">
      {/* Breadcrumbs */}
      <div className="border-b border-border bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center gap-2 text-sm text-muted-foreground">
          <button onClick={() => setLocation('/')} className="hover:text-foreground transition-colors">Home</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => setLocation(`/products?category=${encodeURIComponent(product.category || '')}`)} className="hover:text-foreground transition-colors">{product.category || 'Products'}</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-md">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          
          {/* LEFT: Image Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-4 lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 md:w-20 shrink-0 custom-scrollbar hide-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative shrink-0 aspect-[4/5] w-20 md:w-full rounded-lg overflow-hidden border-2 transition-all ${activeImageIdx === idx ? 'border-primary ring-2 ring-primary/20 ring-offset-1' : 'border-transparent hover:border-primary/50'}`}
                >
                  <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div 
              className="relative flex-1 aspect-[4/5] md:aspect-auto md:h-full bg-muted rounded-2xl overflow-hidden cursor-crosshair border border-border"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImageIdx}
                  src={images[activeImageIdx]}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`w-full h-full object-cover transition-transform duration-200 ease-out ${isZoomed ? 'scale-[2.5]' : 'scale-100'}`}
                  style={isZoomed ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : { transformOrigin: 'center center' }}
                />
              </AnimatePresence>
              
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product.isDeal && (
                  <Badge variant="destructive" className="font-bold uppercase tracking-wider px-3 py-1.5 shadow-lg">
                    Limited Deal
                  </Badge>
                )}
                {discountPercent && (
                  <Badge className="bg-primary text-primary-foreground font-bold uppercase tracking-wider px-3 py-1.5 shadow-lg">
                    -{discountPercent}% OFF
                  </Badge>
                )}
              </div>

              {/* Zoom hint icon (mobile) */}
              <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur text-foreground p-2 rounded-full shadow-sm md:hidden pointer-events-none">
                <SearchZoomIcon className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* RIGHT: Product Details */}
          <div className="flex flex-col">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-primary tracking-widest uppercase">
                  {product.brand}
                </span>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleToggleWishlist}
                    className={`p-2 transition-colors rounded-full ${isWishlisted ? 'text-accent bg-accent/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
              
              <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground leading-[1.1] mb-4">
                {product.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })}>
                  <StarRating rating={product.rating} count={product.reviews} />
                </div>
                <Separator orientation="vertical" className="h-5" />
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Store className="w-4 h-4" />
                  {seller.name}
                </div>
              </div>
              
              <div className="flex items-end gap-3 mb-6">
                <span className="font-display font-bold text-4xl text-foreground leading-none">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xl font-medium text-muted-foreground line-through mb-1">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-base text-foreground/80 leading-relaxed mb-8">
                {product.description}
              </p>
            </div>

            <Separator className="mb-8" />

            {/* Variants */}
            <div className="space-y-8 mb-8">
              {/* Colors */}
              {colors.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-foreground">Color</h3>
                    <span className="text-sm text-muted-foreground">{selectedColor.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {colors.map(color => (
                      <button
                        key={color.name}
                        onClick={() => handleColorChange(color)}
                        className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor.name === color.name ? 'border-primary scale-110' : 'border-transparent hover:scale-105 hover:border-border'}`}
                      >
                        <span 
                          className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 shadow-sm"
                          style={{ backgroundColor: color.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {sizes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-foreground">Size</h3>
                    <button className="text-sm text-primary font-medium hover:underline">Size Guide</button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {sizes.map(size => (
                      <button
                        key={size.name}
                        disabled={!size.inStock}
                        onClick={() => setSelectedSize(size.name)}
                        className={`
                          h-11 px-6 rounded-lg text-sm font-semibold border transition-all
                          ${!size.inStock 
                            ? 'opacity-40 cursor-not-allowed border-dashed bg-muted/50' 
                            : selectedSize === size.name
                              ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                              : 'border-border bg-card hover:border-primary/50 text-foreground'
                          }
                        `}
                      >
                        {size.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Quantity</h3>
                <div className="flex items-center h-12 w-36 border border-border rounded-lg bg-card">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1 h-full flex items-center justify-center font-semibold text-foreground border-x border-border">
                    {quantity}
                  </div>
                  <button 
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="w-12 h-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                size="lg" 
                className="flex-1 h-14 text-base rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 font-bold"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="flex-1 h-14 text-base rounded-xl border-border bg-card hover:bg-accent hover:text-accent-foreground hover:border-accent font-bold transition-colors"
              >
                Buy it Now
              </Button>
            </div>

            {/* Delivery & Guarantees */}
            <div className="bg-secondary/30 rounded-xl p-5 border border-border space-y-4 mb-8">
              <div className="flex gap-4">
                <Truck className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground text-sm mb-1">Shipping & Delivery</h4>
                  <p className="text-sm text-muted-foreground mb-3">{deliveryMsg}</p>
                  <form onSubmit={handleCheckZip} className="flex gap-2">
                    <div className="relative flex-1 max-w-[200px]">
                      <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder="Enter ZIP code" 
                        value={zip}
                        onChange={e => setZip(e.target.value)}
                        className="h-9 pl-8 text-sm bg-background border-border"
                      />
                    </div>
                    <Button type="submit" size="sm" variant="secondary" className="h-9">Update</Button>
                  </form>
                </div>
              </div>
              <Separator />
              <div className="flex gap-4">
                <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground text-sm mb-1">Buyer Protection</h4>
                  <p className="text-sm text-muted-foreground">Full refund if you don't receive your order or if item is not as described.</p>
                </div>
              </div>
            </div>

            {/* Mini Seller Card */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12 border border-border">
                  <AvatarFallback className="font-display font-bold text-lg bg-primary/10 text-primary">{seller.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{seller.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center text-foreground font-medium"><Star className="w-3.5 h-3.5 fill-primary text-primary mr-1" /> {seller.rating}</span>
                    <span>•</span>
                    <span>{seller.sales.toLocaleString()} Sales</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="hidden sm:flex group-hover:bg-primary/10 group-hover:text-primary">
                Visit Store
              </Button>
            </div>

          </div>
        </div>
      </div>

      {/* Tabs Section (Description, Specs, Reviews) */}
      <div className="container mx-auto px-4 md:px-6 mb-20" id="reviews-section">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b border-border rounded-none space-x-8 mb-8 overflow-x-auto hide-scrollbar">
            <TabsTrigger 
              value="description" 
              className="text-base font-semibold px-0 py-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground text-muted-foreground rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Description
            </TabsTrigger>
            <TabsTrigger 
              value="specifications" 
              className="text-base font-semibold px-0 py-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground text-muted-foreground rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Specifications
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="text-base font-semibold px-0 py-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground text-muted-foreground rounded-none border-b-2 border-transparent data-[state=active]:border-primary flex items-center gap-2"
            >
              Reviews <Badge variant="secondary" className="ml-1 rounded-full">{product.reviews}</Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="max-w-4xl pt-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="prose prose-neutral dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:text-foreground/80 prose-headings:font-display">
              <h3 className="text-2xl font-bold mb-4">About this product</h3>
              <p className="mb-6">{product.description}</p>
              <p className="mb-6">
                Designed with meticulous attention to detail, the {product.name} bridges the gap between form and function. 
                Whether you're looking for everyday utility or a statement piece, this carefully crafted item delivers on all fronts. 
                Made from premium materials selected for durability and aesthetic appeal, it's built to withstand the test of time while elevating your space or style.
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Premium craftsmanship and materials</li>
                <li>Thoughtful, user-centric design</li>
                <li>Long-lasting durability for everyday use</li>
                <li>Ethically sourced and produced</li>
              </ul>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                <img src={images[0]} alt="Feature 1" className="w-full aspect-[4/3] object-cover rounded-xl border border-border" />
                {images[1] && <img src={images[1]} alt="Feature 2" className="w-full aspect-[4/3] object-cover rounded-xl border border-border" />}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="specifications" className="max-w-4xl pt-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left">
                <tbody>
                  {specifications.map((spec, i) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <th className="py-4 px-6 font-semibold text-foreground w-1/3 bg-muted/20">{spec.label}</th>
                      <td className="py-4 px-6 text-foreground/80">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="pt-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12 lg:gap-20">
              {/* Ratings Summary */}
              <div>
                <h3 className="font-display font-bold text-2xl mb-6">Customer Reviews</h3>
                <div className="flex flex-col items-center justify-center p-6 bg-secondary/30 rounded-2xl border border-border mb-8 text-center">
                  <div className="font-display font-bold text-5xl text-foreground mb-2">{product.rating.toFixed(1)}</div>
                  <div className="mb-2"><StarRating rating={product.rating} /></div>
                  <div className="text-sm text-muted-foreground">Based on {product.reviews} reviews</div>
                </div>

                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    // Generate fake distribution matching the rating roughly
                    let pct = 0;
                    if (stars === 5) pct = product.rating >= 4.5 ? 75 : 40;
                    else if (stars === 4) pct = product.rating >= 4.0 ? 15 : 40;
                    else if (stars === 3) pct = 5;
                    else if (stars === 2) pct = 3;
                    else pct = 2;
                    
                    return (
                      <div key={stars} className="flex items-center gap-3 text-sm">
                        <div className="w-12 font-medium text-muted-foreground hover:text-foreground cursor-pointer flex items-center">{stars} <Star className="w-3 h-3 ml-1 fill-current" /></div>
                        <Progress value={pct} className="flex-1 h-2" />
                        <div className="w-8 text-right text-muted-foreground">{pct}%</div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-8">
                  <h4 className="font-semibold mb-3">Share your thoughts</h4>
                  <p className="text-sm text-muted-foreground mb-4">If you’ve used this product, share your thoughts with other customers</p>
                  <Button className="w-full font-semibold rounded-full" variant="outline">Write a Review</Button>
                </div>
              </div>

              {/* Review List */}
              <div className="space-y-8">
                {reviews.map((review) => (
                  <div key={review.id} className="pb-8 border-b border-border last:border-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border border-border">
                          <AvatarFallback className="bg-primary/5 text-primary text-sm font-semibold">{review.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-foreground flex items-center gap-2">
                            {review.author}
                            {review.verified && (
                              <span className="text-[10px] flex items-center text-primary bg-primary/10 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                                <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">{review.date}</div>
                        </div>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    <h5 className="font-bold text-base mb-2 text-foreground">{review.title}</h5>
                    <p className="text-foreground/80 leading-relaxed text-sm mb-4">{review.body}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                        <ThumbsUpIcon className="w-3.5 h-3.5" /> Helpful ({review.helpfulCount})
                      </button>
                      <button className="hover:text-foreground transition-colors">Report</button>
                    </div>
                  </div>
                ))}
                
                {product.reviews > reviews.length && (
                  <div className="pt-4 text-center">
                    <Button variant="outline" className="rounded-full font-semibold px-8">Load More Reviews</Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Frequently Bought Together */}
      {bundleProducts.length > 0 && (
        <section className="bg-secondary/30 py-20 border-y border-border">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="font-display font-bold text-3xl mb-10">Frequently Bought Together</h2>
            
            <div className="flex flex-col lg:flex-row gap-10 items-center">
              {/* Bundle Products Visual */}
              <div className="flex-1 flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-8">
                {/* Main Product */}
                <div className="w-32 md:w-48 group">
                  <div className="aspect-[4/5] rounded-xl overflow-hidden bg-background border border-border shadow-sm mb-3">
                    <img src={images[0]} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="text-xs md:text-sm font-semibold truncate">This Item: {product.name}</h4>
                  <p className="text-xs md:text-sm font-bold mt-1">${product.price.toFixed(2)}</p>
                </div>
                
                <Plus className="w-6 h-6 text-muted-foreground shrink-0" />
                
                {/* Bundle Item 1 */}
                <div className="w-32 md:w-48 group cursor-pointer" onClick={() => setLocation(`/product/${bundleProducts[0].id}`)}>
                  <div className="aspect-[4/5] rounded-xl overflow-hidden bg-background border border-border shadow-sm mb-3 group-hover:border-primary transition-colors">
                    <img src={bundleProducts[0].imageUrl} alt={bundleProducts[0].name} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="text-xs md:text-sm font-semibold truncate group-hover:text-primary transition-colors">{bundleProducts[0].name}</h4>
                  <p className="text-xs md:text-sm font-bold mt-1">${bundleProducts[0].price.toFixed(2)}</p>
                </div>

                {bundleProducts[1] && (
                  <>
                    <Plus className="w-6 h-6 text-muted-foreground shrink-0" />
                    {/* Bundle Item 2 */}
                    <div className="w-32 md:w-48 group cursor-pointer" onClick={() => setLocation(`/product/${bundleProducts[1].id}`)}>
                      <div className="aspect-[4/5] rounded-xl overflow-hidden bg-background border border-border shadow-sm mb-3 group-hover:border-primary transition-colors">
                        <img src={bundleProducts[1].imageUrl} alt={bundleProducts[1].name} className="w-full h-full object-cover" />
                      </div>
                      <h4 className="text-xs md:text-sm font-semibold truncate group-hover:text-primary transition-colors">{bundleProducts[1].name}</h4>
                      <p className="text-xs md:text-sm font-bold mt-1">${bundleProducts[1].price.toFixed(2)}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Bundle Action */}
              <div className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm w-full lg:w-80 shrink-0 flex flex-col items-center lg:items-start text-center lg:text-left">
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">Total Price:</h3>
                <div className="font-display font-bold text-4xl text-foreground mb-6">
                  ${bundleTotal.toFixed(2)}
                </div>
                <Button 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-14"
                  onClick={handleAddBundle}
                >
                  Add all 3 to Cart
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-20 container mx-auto px-4 md:px-6 max-w-[1600px]">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-display font-bold text-3xl md:text-4xl">You Might Also Like</h2>
            <Button variant="ghost" className="hidden sm:flex items-center gap-2 font-semibold" onClick={() => setLocation(`/products?category=${encodeURIComponent(product.category || '')}`)}>
              View Category <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {relatedProducts.map((relatedProd) => (
                <CarouselItem key={relatedProd.id} className="pl-4 md:pl-6 basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="h-full">
                    <ProductCard 
                      {...relatedProd}
                      onAddToCart={() => {
                        onAddToCart(relatedProd);
                        toast({ title: "Added to Cart", description: `${relatedProd.name} added.` });
                      }}
                      onToggleWishlist={(isAdded) => {
                        onToggleWishlist(relatedProd, isAdded);
                        if (isAdded) toast({ title: "Saved to Wishlist" });
                      }}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden lg:flex justify-end gap-2 mt-8">
              <CarouselPrevious className="relative inset-0 translate-y-0 h-12 w-12 border-border bg-card hover:bg-muted" />
              <CarouselNext className="relative inset-0 translate-y-0 h-12 w-12 border-border bg-card hover:bg-muted" />
            </div>
          </Carousel>
        </section>
      )}
    </div>
  );
}

function SearchZoomIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

function ThumbsUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  );
}
