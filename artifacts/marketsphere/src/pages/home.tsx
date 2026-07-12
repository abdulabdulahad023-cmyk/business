import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { CategoryCard } from '@/components/category-card';
import { useToast } from '@/hooks/use-toast';
import { CATEGORIES, FEATURED_PRODUCTS, DAILY_DEALS } from '@/lib/mock-data';
import { Product } from '@/types';

import heroImg from '@assets/generated_images/hero.jpg';

export function Home({ 
  onAddToCart, 
  onToggleWishlist 
}: { 
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product, isAdded: boolean) => void;
}) {
  const { toast } = useToast();

  const handleAddToCart = (product: Product) => {
    onAddToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
      duration: 3000,
    });
  };

  const handleToggleWishlist = (product: Product, isAdded: boolean) => {
    onToggleWishlist(product, isAdded);
    if (isAdded) {
      toast({
        title: "Saved to Wishlist",
        description: `${product.name} has been saved for later.`,
        duration: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-10 pb-20 px-4 md:px-6 lg:px-8">
        <div className="absolute inset-4 md:inset-6 lg:inset-8 rounded-[2rem] overflow-hidden -z-10">
          <img 
            src={heroImg} 
            alt="Premium minimalist living space" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-[2px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Curated by taste. Driven by design.</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="font-display font-bold text-5xl md:text-7xl lg:text-8xl text-white tracking-tighter leading-[1.1] mb-6"
          >
            The Marketplace <br />
            <span className="text-white/80 italic font-medium">for the Discerning</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-white/80 max-w-2xl font-medium leading-relaxed mb-10"
          >
            Discover exceptional products from independent creators and established brands. No clutter, no compromises—just remarkable design.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Button size="lg" className="h-14 px-8 text-base rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20">
              Shop New Arrivals
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md font-semibold">
              Explore Brands
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 px-4 md:px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-3">Shop by Category</h2>
            <p className="text-muted-foreground text-lg">Explore our curated collections</p>
          </div>
          <Button variant="ghost" className="hidden md:flex items-center gap-2 group font-semibold">
            View All Categories
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((category, index) => (
            <CategoryCard 
              key={category.id} 
              {...category} 
              delay={index * 0.1} 
            />
          ))}
        </div>
        
        <Button variant="outline" className="w-full mt-8 md:hidden h-12 rounded-full font-semibold">
          View All Categories
        </Button>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-[1600px] mx-auto w-full">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight">Featured Editor's Picks</h2>
              <p className="text-muted-foreground mt-1">Exceptional pieces that define modern living</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {FEATURED_PRODUCTS.map((product) => (
              <ProductCard 
                key={product.id} 
                {...product} 
                onAddToCart={() => handleAddToCart(product)}
                onToggleWishlist={(isAdded) => handleToggleWishlist(product, isAdded)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* DAILY DEALS */}
      <section className="py-24 px-4 md:px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-border pb-6">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive animate-pulse">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight">Today's Deals</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-muted-foreground">Ends in</span>
                <div className="flex items-center gap-1 font-mono font-bold text-sm bg-muted px-2 py-1 rounded">
                  <span>04</span>:<span>12</span>:<span>59</span>
                </div>
              </div>
            </div>
          </div>
          <Button variant="link" className="group font-semibold text-primary self-start md:self-auto p-0">
            See all daily deals
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {DAILY_DEALS.map((product) => (
            <ProductCard 
              key={product.id} 
              {...product} 
              onAddToCart={() => handleAddToCart(product)}
              onToggleWishlist={(isAdded) => handleToggleWishlist(product, isAdded)}
            />
          ))}
        </div>
      </section>
      
      {/* BRAND VALUES / TRUST */}
      <section className="py-20 px-4 border-t border-border bg-card">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="flex flex-col items-center pt-8 md:pt-0">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-xl mb-3">Curated Quality</h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs">Every product on MarketSphere passes a rigorous quality and design review.</p>
            </div>
            <div className="flex flex-col items-center pt-8 md:pt-0">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-xl mb-3">Independent Makers</h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs">Support global artisans, innovative startups, and independent brands directly.</p>
            </div>
            <div className="flex flex-col items-center pt-8 md:pt-0">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-xl mb-3">Carbon Neutral</h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs">Every shipment is 100% carbon neutral. Good design shouldn't cost the earth.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
