import { useState, useMemo } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link, useLocation } from 'wouter';
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ALL_PRODUCTS, CATEGORIES } from '@/lib/mock-data';

export function SearchSuggestions() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      setOpen(false);
      setLocation(`/products?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return ALL_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.brand.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [query]);

  const filteredCategories = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return CATEGORIES.filter(c => 
      c.name.toLowerCase().includes(q)
    ).slice(0, 3);
  }, [query]);

  const hasResults = filteredProducts.length > 0 || filteredCategories.length > 0;

  return (
    <Popover open={open && query.length > 0} onOpenChange={setOpen}>
      <div className="relative group w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        </div>
        <PopoverAnchor asChild>
          <Input 
            type="search" 
            placeholder="Search for products, brands, or categories..." 
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setOpen(true)}
            className="w-full pl-10 pr-4 bg-muted/50 border-transparent focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary rounded-full transition-all duration-300 h-11"
          />
        </PopoverAnchor>
      </div>

      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-0 rounded-xl overflow-hidden shadow-lg border-border" 
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <ScrollArea className="max-h-[60vh] overflow-y-auto">
          {hasResults ? (
            <div className="py-2">
              {filteredCategories.length > 0 && (
                <div className="px-2">
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Categories
                  </div>
                  {filteredCategories.map(cat => (
                    <Link key={cat.id} href={`/category/${cat.id}`}>
                      <div 
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted cursor-pointer transition-colors"
                      >
                        <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center overflow-hidden">
                          <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-medium text-sm">{cat.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {filteredCategories.length > 0 && filteredProducts.length > 0 && (
                <div className="h-px bg-border my-2 mx-4" />
              )}

              {filteredProducts.length > 0 && (
                <div className="px-2">
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Products
                  </div>
                  {filteredProducts.map(prod => (
                    <Link key={prod.id} href={`/product/${prod.id}`}>
                      <div 
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted cursor-pointer transition-colors"
                      >
                        <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                          <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="font-medium text-sm truncate">{prod.name}</span>
                          <span className="text-xs text-muted-foreground">{prod.brand}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              
              {query.trim().length > 0 && (
                <>
                  <div className="h-px bg-border my-2 mx-4" />
                  <Link href={`/products?q=${encodeURIComponent(query.trim())}`}>
                    <div 
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 text-sm font-semibold text-primary hover:text-primary/80 hover:bg-muted/50 transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <span>View all results for "{query}"</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </>
              )}
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center justify-center text-center px-4">
              <p className="text-muted-foreground text-sm mb-4">
                No results found for "{query}"
              </p>
              <Link href={`/products?q=${encodeURIComponent(query.trim())}`}>
                <div 
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-primary bg-primary/10 rounded-full hover:bg-primary/20 transition-colors inline-flex items-center gap-2 group cursor-pointer"
                >
                  Search all products
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
