import { useState } from 'react';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';

import { MegaMenu } from './navbar/mega-menu';
import { SearchSuggestions } from './navbar/search-suggestions';
import { UserDropdown } from './navbar/user-dropdown';
import { Notifications } from './navbar/notifications';
import { CartPreview } from './navbar/cart-preview';
import { WishlistPreview } from './navbar/wishlist-preview';
import { MobileMenu } from './navbar/mobile-menu';
import { WishlistItem } from '@/types';

export function Navbar({ 
  wishlistItems 
}: { 
  wishlistItems: WishlistItem[];
}) {
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll to add background blur/shadow
  useState(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/85 backdrop-blur-lg border-b border-border shadow-sm py-3' 
          : 'bg-background/50 backdrop-blur-sm py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <MobileMenu />
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 z-10 shrink-0">
              <span className="font-display font-bold text-2xl tracking-tighter text-foreground">
                MarketSphere<span className="text-primary">.</span>
              </span>
            </Link>
            
            {/* Desktop Navigation Links (Mega Menu) */}
            <div className="ml-4">
              <MegaMenu />
            </div>
          </div>

          {/* Search (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg xl:max-w-xl relative group ml-auto mr-4">
            <SearchSuggestions />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full text-foreground/80 hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <Notifications />
            <UserDropdown />
            <WishlistPreview items={wishlistItems} />
            <CartPreview />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
