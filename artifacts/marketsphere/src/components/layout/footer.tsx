import { Link } from 'wouter';

export function Footer() {
  return (
    <footer className="bg-foreground text-background pt-16 pb-8 border-t border-border mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-4">
            <span className="font-display font-bold text-2xl tracking-tighter">
              MarketSphere<span className="text-primary">.</span>
            </span>
            <p className="text-background/70 text-sm max-w-xs leading-relaxed">
              A curated marketplace for independent brands and discerning buyers. We believe in quality, design, and exceptional experiences.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 font-display text-lg tracking-tight">Shop</h3>
            <ul className="space-y-3 text-sm text-background/70">
              <li><Link href="/categories/electronics" className="hover:text-primary transition-colors">Electronics & Audio</Link></li>
              <li><Link href="/categories/fashion" className="hover:text-primary transition-colors">Fashion & Apparel</Link></li>
              <li><Link href="/categories/home" className="hover:text-primary transition-colors">Home & Living</Link></li>
              <li><Link href="/categories/beauty" className="hover:text-primary transition-colors">Beauty & Wellness</Link></li>
              <li><Link href="/deals" className="hover:text-primary transition-colors">Today's Deals</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 font-display text-lg tracking-tight">Support</h3>
            <ul className="space-y-3 text-sm text-background/70">
              <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/track" className="hover:text-primary transition-colors">Track Order</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 font-display text-lg tracking-tight">Newsletter</h3>
            <p className="text-sm text-background/70 mb-4">Subscribe for exclusive offers, new arrivals, and design inspiration.</p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-background/10 border border-background/20 rounded-l-md px-4 py-2 text-sm w-full focus:outline-none focus:border-primary transition-colors text-background placeholder:text-background/40"
              />
              <button 
                type="submit" 
                className="bg-primary text-primary-foreground px-4 py-2 rounded-r-md text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="pt-8 border-t border-background/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-background/50">
          <p>&copy; {new Date().getFullYear()} MarketSphere. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-background transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-background transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
