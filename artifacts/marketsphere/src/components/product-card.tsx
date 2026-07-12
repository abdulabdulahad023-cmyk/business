import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';

interface ProductCardProps extends Product {
  onAddToCart: () => void;
  onToggleWishlist: (isAdded: boolean) => void;
}

export function ProductCard({
  name,
  brand,
  price,
  originalPrice,
  rating,
  reviews,
  imageUrl,
  onAddToCart,
  onToggleWishlist,
  isDeal
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newValue = !isWishlisted;
    setIsWishlisted(newValue);
    onToggleWishlist(newValue);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart();
  };

  return (
    <motion.div 
      className="group relative flex flex-col bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {isDeal && (
          <span className="bg-destructive text-destructive-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
            Limited Deal
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button 
        onClick={handleWishlist}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
          isWishlisted 
            ? 'bg-accent text-accent-foreground shadow-sm' 
            : 'bg-background/50 text-foreground/70 hover:bg-background hover:text-foreground hover:shadow-sm opacity-0 group-hover:opacity-100 md:opacity-100'
        }`}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />
        
        {/* Quick Add overlay */}
        <div className={`absolute inset-x-0 bottom-0 p-4 translate-y-full transition-transform duration-300 ease-in-out ${isHovered ? 'translate-y-0' : ''}`}>
          <Button 
            className="w-full bg-background/90 text-foreground hover:bg-primary hover:text-primary-foreground backdrop-blur-sm border border-border shadow-sm font-semibold h-11"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-1 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
          {brand}
        </div>
        <h3 className="font-display font-semibold text-foreground line-clamp-2 mb-2 leading-tight">
          {name}
        </h3>
        
        <div className="flex items-center gap-1 mb-auto pb-4 text-xs text-muted-foreground">
          <Star className="w-3.5 h-3.5 fill-primary text-primary" />
          <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
          <span>({reviews})</span>
        </div>
        
        <div className="flex items-end justify-between mt-auto">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-lg text-foreground">
              ${price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
