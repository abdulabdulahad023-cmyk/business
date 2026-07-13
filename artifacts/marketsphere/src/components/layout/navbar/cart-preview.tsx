import { ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { useCartStore, useCartTotals } from '@/lib/cart-store';

export function CartPreview() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const { itemCount, subtotal } = useCartTotals();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full relative text-foreground/80 hover:text-foreground">
          <ShoppingBag className="h-5 w-5" />
          <AnimatePresence>
            {itemCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute top-1 right-0.5 h-4 w-4 text-[10px] font-bold bg-primary text-primary-foreground rounded-full flex items-center justify-center border-2 border-background"
              >
                {itemCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 mt-2 rounded-xl p-0 shadow-xl">
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <h3 className="font-display font-semibold text-sm">Shopping Cart ({itemCount})</h3>
        </div>
        
        <ScrollArea className="max-h-[320px]">
          {items.length > 0 ? (
            <div className="flex flex-col p-2">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors group"
                  >
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-secondary shrink-0 border border-border">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0 justify-between py-0.5">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="text-sm font-medium leading-tight truncate flex-1">{item.name}</h4>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.brand}</p>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center border border-border rounded bg-background">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <ShoppingBag className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">Your cart is empty</p>
              <p className="text-xs text-muted-foreground mt-1">Discover our curated collection and add some items.</p>
            </div>
          )}
        </ScrollArea>
        
        {items.length > 0 && (
          <div className="p-4 border-t border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Subtotal</span>
              <span className="font-display font-bold text-lg">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" className="flex-1 rounded-full font-semibold">
                <Link href="/cart">View Cart</Link>
              </Button>
              <Button className="flex-1 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">Checkout</Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}