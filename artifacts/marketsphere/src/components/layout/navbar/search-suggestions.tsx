import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link } from 'wouter';
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ALL_PRODUCTS, CATEGORIES } from '@/lib/mock-data';

export function SearchSuggestions() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

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
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground text-sm">
              No results found for "{query}"
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
