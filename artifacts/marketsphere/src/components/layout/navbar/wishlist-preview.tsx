import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WishlistItem } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export function WishlistPreview({ items }: { items: WishlistItem[] }) {
  const itemCount = items.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full relative text-foreground/80 hover:text-foreground">
          <Heart className="h-5 w-5" />
          <AnimatePresence>
            {itemCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute top-1 right-0.5 h-4 w-4 text-[10px] font-bold bg-accent text-accent-foreground rounded-full flex items-center justify-center border-2 border-background"
              >
                {itemCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 mt-2 rounded-xl p-0 shadow-xl">
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <h3 className="font-display font-semibold text-sm">Wishlist ({itemCount})</h3>
        </div>
        
        <ScrollArea className="max-h-[320px]">
          {items.length > 0 ? (
            <div className="flex flex-col p-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors group">
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-secondary shrink-0 border border-border">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0 justify-between py-0.5">
                    <div>
                      <h4 className="text-sm font-medium leading-tight truncate">{item.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.brand}</p>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-bold">${item.price.toFixed(2)}</span>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs hover:bg-background shadow-sm border border-transparent hover:border-border">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Heart className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">Your wishlist is empty</p>
              <p className="text-xs text-muted-foreground mt-1">Save your favorite items here to review later.</p>
            </div>
          )}
        </ScrollArea>
        
        {items.length > 0 && (
          <div className="p-4 border-t border-border bg-card">
            <Button className="w-full rounded-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
              View Full Wishlist
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
