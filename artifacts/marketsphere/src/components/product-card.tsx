import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Star, StarHalf, Eye, Zap, CreditCard, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Product } from '@/types';
import { Link, useLocation } from 'wouter';

interface ProductCardProps extends Product {
  onAddToCart: () => void;
  onToggleWishlist: (isAdded: boolean) => void;
}

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5 text-primary">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-3.5 h-3.5 fill-current" />
      ))}
      {hasHalfStar && <StarHalf key="half" className="w-3.5 h-3.5 fill-current" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-3.5 h-3.5 text-muted-foreground/30" />
      ))}
    </div>
  );
}

export function ProductCard({
  id,
  name,
  brand,
  price,
  originalPrice,
  rating,
  reviews,
  imageUrl,
  description,
  isDeal,
  onAddToCart,
  onToggleWishlist,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [, setLocation] = useLocation();
  
  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newValue = !isWishlisted;
    setIsWishlisted(newValue);
    onToggleWishlist(newValue);
  };

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onAddToCart();
  };

  const handleBuyNow = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onAddToCart();
    setLocation('/cart');
  };

  const discountPercent = originalPrice && originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : null;

  return (
    <Dialog>
      <motion.div 
        className="group relative flex flex-col bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -4 }}
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 items-start pointer-events-none">
          {isDeal && (
            <Badge variant="destructive" className="font-bold uppercase tracking-wider px-2.5 py-1">
              <Zap className="w-3 h-3 mr-1" /> Limited Deal
            </Badge>
          )}
          {discountPercent && (
            <Badge className="bg-primary text-primary-foreground font-bold uppercase tracking-wider px-2.5 py-1">
              -{discountPercent}%
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={handleWishlist}
          className={`absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${
            isWishlisted 
              ? 'bg-accent text-accent-foreground shadow-sm' 
              : 'bg-background/80 text-foreground/70 hover:bg-background hover:text-foreground hover:shadow-sm opacity-0 group-hover:opacity-100 md:opacity-100'
          }`}
          aria-label="Toggle Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Image Container */}
        <Link href={`/product/${id}`}>
          <div className="relative aspect-[4/5] overflow-hidden bg-muted cursor-pointer">
            <img 
              src={imageUrl} 
              alt={name} 
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            
            {/* Quick Actions Overlay */}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            <div className={`absolute inset-x-0 bottom-0 p-4 flex flex-col gap-2 translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isHovered ? 'translate-y-0' : ''}`}>
              <DialogTrigger asChild>
                <Button 
                  variant="secondary"
                  className="w-full bg-background/95 hover:bg-background text-foreground backdrop-blur-sm border border-border shadow-sm font-semibold h-11 transition-all"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Quick View
                </Button>
              </DialogTrigger>
            </div>
          </div>
        </Link>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1 bg-card relative z-20">
          <div className="mb-1.5 text-[11px] font-semibold text-muted-foreground tracking-widest uppercase">
            {brand}
          </div>
          <Link href={`/product/${id}`}>
            <h3 className="font-display font-semibold text-foreground line-clamp-2 mb-2.5 leading-tight group-hover:text-primary transition-colors duration-200 cursor-pointer">
              {name}
            </h3>
          </Link>
          
          <div className="flex items-center gap-2 mb-auto pb-4">
            <StarRating rating={rating} />
            <span className="text-xs font-medium text-foreground">{rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({reviews})</span>
          </div>
          
          <div className="flex items-end justify-between mt-auto mb-4">
            <div className="flex flex-col">
              {originalPrice && originalPrice > price && (
                <span className="text-xs font-medium text-muted-foreground line-through mb-0.5">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
              <span className="font-display font-bold text-xl text-foreground leading-none">
                ${price.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10 px-0"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Add
            </Button>
            <Button 
              variant="outline"
              className="w-full hover:bg-accent hover:text-accent-foreground hover:border-accent font-semibold h-10 px-0 transition-colors"
              onClick={handleBuyNow}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Buy Now
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Quick View Dialog Modal */}
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-card border-none shadow-2xl rounded-2xl sm:rounded-[2rem]">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full max-h-[90vh] md:max-h-[600px]">
          {/* Left: Image */}
          <div className="relative bg-muted h-64 md:h-full">
            <img 
              src={imageUrl} 
              alt={name} 
              className="w-full h-full object-cover object-center"
            />
            {isDeal && (
              <div className="absolute top-4 left-4">
                <Badge variant="destructive" className="font-bold uppercase tracking-wider px-3 py-1.5 shadow-lg">
                  <Zap className="w-3.5 h-3.5 mr-1.5" /> Limited Deal
                </Badge>
              </div>
            )}
          </div>
          
          {/* Right: Details */}
          <div className="flex flex-col p-6 md:p-10 overflow-y-auto">
            <DialogHeader className="mb-6 text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                  {brand}
                </span>
                <button 
                  onClick={handleWishlist}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    isWishlisted 
                      ? 'bg-accent/10 text-accent' 
                      : 'bg-muted hover:bg-muted/80 text-foreground/70'
                  }`}
                  aria-label="Toggle Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
              <DialogTitle className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-foreground leading-tight mb-4">
                {name}
              </DialogTitle>
              
              <div className="flex items-center gap-3 mb-2">
                <StarRating rating={rating} />
                <span className="text-sm font-medium text-foreground">{rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground underline decoration-muted-foreground/30 underline-offset-4 cursor-pointer hover:text-foreground transition-colors">Read {reviews} Reviews</span>
              </div>
            </DialogHeader>

            <div className="flex items-end gap-3 mb-6 pb-6 border-b border-border">
              <span className="font-display font-bold text-3xl md:text-4xl text-foreground leading-none">
                ${price.toFixed(2)}
              </span>
              {originalPrice && originalPrice > price && (
                <>
                  <span className="text-lg font-medium text-muted-foreground line-through mb-1">
                    ${originalPrice.toFixed(2)}
                  </span>
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/10 font-bold uppercase tracking-wider px-2 py-0.5 mb-1.5">
                    {discountPercent}% OFF
                  </Badge>
                </>
              )}
            </div>

            <DialogDescription className="text-base text-foreground/80 leading-relaxed mb-8">
              {description || "An exceptional piece crafted with meticulous attention to detail. Blending timeless design with modern functionality to elevate your everyday experience."}
            </DialogDescription>

            <div className="mt-auto space-y-4 pt-4">
              <Button 
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-14 text-base rounded-full shadow-lg shadow-primary/20"
                onClick={() => {
                  handleAddToCart();
                }}
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <div className="flex gap-4">
                <Button 
                  size="lg"
                  variant="outline"
                  className="flex-1 font-semibold h-14 text-base rounded-full border-border hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all"
                  onClick={() => {
                    handleBuyNow();
                  }}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Buy It Now
                </Button>
                <DialogClose asChild>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="flex-1 font-semibold h-14 text-base rounded-full border border-transparent bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-all"
                    onClick={() => setLocation(`/product/${id}`)}
                  >
                    Full Details
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </DialogClose>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
