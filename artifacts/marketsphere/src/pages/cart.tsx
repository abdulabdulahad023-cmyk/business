import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Trash2, Heart, Plus, Minus, ArrowRight, 
  Tag, X, Check, ArrowLeft, Truck, Package, ShieldCheck
} from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useCartStore, useCartTotals } from '@/lib/cart-store';
import { Product } from '@/types';

export function Cart() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { 
    items, 
    savedForLater, 
    coupon,
    removeItem, 
    updateQuantity, 
    moveToSavedForLater, 
    moveToCart, 
    removeFromSaved,
    applyCoupon,
    removeCoupon 
  } = useCartStore();

  const {
    itemCount,
    subtotal,
    discountAmount,
    shippingCost,
    estimatedTax,
    total,
    progressToFreeShipping,
    amountToFreeShipping,
    FREE_SHIPPING_THRESHOLD
  } = useCartTotals();

  const [couponCode, setCouponCode] = useState('');

  const handleQuantityChange = (id: string, currentQty: number, change: number) => {
    const newQty = currentQty + change;
    if (newQty > 0) {
      updateQuantity(id, newQty);
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    
    const result = applyCoupon(couponCode);
    if (result.success) {
      toast({ title: 'Coupon Applied', description: result.message });
      setCouponCode('');
    } else {
      toast({ variant: 'destructive', title: 'Invalid Coupon', description: result.message });
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    toast({ title: 'Coupon Removed' });
  };

  const handleCheckout = () => {
    toast({ 
      title: "Checkout Unavailable", 
      description: "This is a demo application. Checkout flow is not implemented.",
      duration: 3000
    });
  };

  if (items.length === 0 && savedForLater.length === 0) {
    return (
      <div className="flex-1 container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-muted-foreground" />
        </div>
        <h1 className="font-display font-bold text-3xl mb-3 text-foreground">Your cart is empty</h1>
        <p className="text-muted-foreground max-w-md text-center mb-8">
          Looks like you haven't added anything to your cart yet. Discover our curated collection of premium products.
        </p>
        <Button asChild size="lg" className="rounded-full px-8 h-14 font-semibold text-base">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col bg-background pb-20">
      <div className="bg-secondary/30 border-b border-border py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="font-display font-bold text-3xl md:text-5xl text-foreground">
            Shopping Cart
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Main Cart Items */}
          <div className="flex-1 w-full min-w-0 flex flex-col">
            
            {items.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <h2 className="text-lg font-semibold">Items in your cart ({itemCount})</h2>
                  <Button variant="ghost" size="sm" asChild className="hidden sm:flex text-muted-foreground">
                    <Link href="/products">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
                
                <div className="space-y-6">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                        className="flex flex-col sm:flex-row gap-5 p-4 rounded-xl border border-border bg-card shadow-sm group"
                      >
                        <Link href={`/product/${item.id}`} className="shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-muted rounded-lg overflow-hidden border border-border block">
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        </Link>
                        
                        <div className="flex flex-col flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-2">
                            <div>
                              <div className="text-xs font-medium text-muted-foreground mb-1 tracking-wider uppercase">{item.brand}</div>
                              <Link href={`/product/${item.id}`}>
                                <h3 className="font-display font-semibold text-lg text-foreground leading-tight hover:text-primary transition-colors">{item.name}</h3>
                              </Link>
                              
                              {/* Display simple variants if they exist (mocked) */}
                              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                {item.colors && item.colors.length > 0 && <span>Color: {item.colors[0].name}</span>}
                                {item.colors && item.sizes && <span>•</span>}
                                {item.sizes && item.sizes.length > 0 && <span>Size: {item.sizes[0].name}</span>}
                              </div>
                            </div>
                            
                            <div className="text-left sm:text-right">
                              <div className="font-display font-bold text-xl">${(item.price * item.quantity).toFixed(2)}</div>
                              {item.quantity > 1 && <div className="text-sm text-muted-foreground mt-0.5">${item.price.toFixed(2)} each</div>}
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-end justify-between gap-4 mt-auto pt-4">
                            <div className="flex items-center h-10 w-32 border border-border rounded-lg bg-background">
                              <button 
                                onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                disabled={item.quantity <= 1}
                                className="w-10 h-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <div className="flex-1 h-full flex items-center justify-center font-semibold text-foreground border-x border-border">
                                {item.quantity}
                              </div>
                              <button 
                                onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                className="w-10 h-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => {
                                  moveToSavedForLater(item.id);
                                  toast({ title: "Moved to Saved", description: `${item.name} saved for later.` });
                                }}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <Heart className="w-4 h-4 mr-2" />
                                Save for later
                              </Button>
                              <Separator orientation="vertical" className="h-4" />
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => {
                                  removeItem(item.id);
                                  toast({ title: "Item removed", description: `${item.name} removed from cart.` });
                                }}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="bg-muted/30 border border-dashed border-border rounded-2xl p-10 flex flex-col items-center justify-center text-center">
                <ShoppingBag className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="font-display font-semibold text-xl mb-2">Your active cart is empty</h3>
                <p className="text-muted-foreground mb-6">Check your saved items below or explore our catalog.</p>
                <Button asChild>
                  <Link href="/products">Explore Products</Link>
                </Button>
              </div>
            )}
            
            {/* Saved For Later Section */}
            {savedForLater.length > 0 && (
              <div className="mt-16 pt-8 border-t border-border">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Saved for Later ({savedForLater.length})
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AnimatePresence mode="popLayout">
                    {savedForLater.map((item) => (
                      <motion.div
                        key={`saved-${item.id}`}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex gap-4 p-4 rounded-xl border border-border bg-card shadow-sm"
                      >
                        <Link href={`/product/${item.id}`} className="shrink-0 w-20 h-20 bg-muted rounded-md overflow-hidden border border-border block">
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        </Link>
                        
                        <div className="flex flex-col flex-1 min-w-0">
                          <Link href={`/product/${item.id}`}>
                            <h3 className="font-medium text-sm text-foreground leading-tight line-clamp-2 hover:text-primary mb-1">{item.name}</h3>
                          </Link>
                          <div className="font-bold text-foreground mb-auto">${item.price.toFixed(2)}</div>
                          
                          <div className="flex items-center gap-2 mt-3">
                            <Button 
                              size="sm" 
                              className="h-8 px-3 text-xs w-full"
                              onClick={() => {
                                moveToCart(item.id);
                                toast({ title: "Moved to Cart", description: `${item.name} moved back to cart.` });
                              }}
                            >
                              Move to Cart
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                              onClick={() => {
                                removeFromSaved(item.id);
                                toast({ title: "Item removed", description: `${item.name} removed from saved items.` });
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
            
          </div>
          
          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0">
            <div className="sticky top-28 flex flex-col gap-6">
              
              {/* Shipping Progress */}
              {items.length > 0 && !coupon?.freeShipping && (
                <div className="bg-secondary/30 rounded-xl p-5 border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Truck className="w-4 h-4" />
                    </div>
                    {amountToFreeShipping > 0 ? (
                      <div className="text-sm font-medium">
                        Add <span className="font-bold text-primary">${amountToFreeShipping.toFixed(2)}</span> more for free shipping
                      </div>
                    ) : (
                      <div className="text-sm font-medium text-primary flex items-center gap-1">
                        <Check className="w-4 h-4" /> You've unlocked free shipping!
                      </div>
                    )}
                  </div>
                  <Progress value={progressToFreeShipping} className="h-2" />
                </div>
              )}
              
              {/* Summary Card */}
              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 pb-4 border-b border-border bg-muted/20">
                  <h2 className="font-display font-bold text-xl">Order Summary</h2>
                </div>
                
                <div className="p-6 flex flex-col gap-6">
                  
                  {/* Coupon Form */}
                  <div>
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          placeholder="Promo code (e.g. WELCOME10)" 
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="pl-9 h-11 uppercase"
                          disabled={!!coupon}
                        />
                      </div>
                      <Button type="submit" disabled={!!coupon || !couponCode.trim()} className="h-11 px-6">Apply</Button>
                    </form>
                    
                    {coupon && (
                      <div className="mt-3 flex items-center justify-between p-2.5 px-3 bg-primary/10 border border-primary/20 rounded-lg">
                        <div className="flex items-center gap-2 text-primary font-medium text-sm">
                          <Check className="w-4 h-4" />
                          Code {coupon.code} applied
                        </div>
                        <button onClick={handleRemoveCoupon} className="text-primary/70 hover:text-primary">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  {/* Totals */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-primary">
                        <span>Discount ({coupon?.discountPercent}%)</span>
                        <span className="font-medium">-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated Shipping</span>
                      <span className="font-medium">
                        {shippingCost === 0 
                          ? <span className="text-primary">Free</span> 
                          : `$${shippingCost.toFixed(2)}`
                        }
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated Tax</span>
                      <span className="font-medium">${estimatedTax.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-end">
                    <span className="font-semibold text-base">Total</span>
                    <span className="font-display font-bold text-3xl leading-none">${total.toFixed(2)}</span>
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="w-full h-14 text-base rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 mt-2"
                    disabled={items.length === 0}
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
                
                {/* Trust Badges */}
                <div className="bg-muted/30 p-5 border-t border-border flex items-center justify-center gap-6">
                  <div className="flex flex-col items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <ShieldCheck className="w-5 h-5" />
                    Secure
                  </div>
                  <div className="flex flex-col items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <Package className="w-5 h-5" />
                    Returns
                  </div>
                </div>
              </div>
              
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}