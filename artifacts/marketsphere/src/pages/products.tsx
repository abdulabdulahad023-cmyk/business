import { useState, useMemo, useEffect } from 'react';
import { useLocation, useSearch } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SlidersHorizontal, Search as SearchIcon, X, Check, Star } from 'lucide-react';

import { Product } from '@/types';
import { ALL_PRODUCTS, CATEGORIES } from '@/lib/mock-data';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter
} from '@/components/ui/sheet';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

import { useCartStore } from '@/lib/cart-store';
import { useToast } from '@/hooks/use-toast';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

const ITEMS_PER_PAGE = 12;

export function Products({ 
  onToggleWishlist 
}: { 
  onToggleWishlist: (p: Product, isAdded: boolean) => void;
}) {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const { toast } = useToast();
  const addItem = useCartStore(state => state.addItem);

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
      duration: 3000,
    });
  };
  
  // Parse URL search params
  const searchParams = useMemo(() => new URLSearchParams(searchString), [searchString]);
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') ? [searchParams.get('category')!] : [];

  // Data ranges
  const minProductPrice = Math.floor(Math.min(...ALL_PRODUCTS.map(p => p.price)));
  const maxProductPrice = Math.ceil(Math.max(...ALL_PRODUCTS.map(p => p.price)));
  const allBrands = Array.from(new Set(ALL_PRODUCTS.map(p => p.brand))).sort();
  const allCategories = CATEGORIES.map(c => c.name).sort();

  // Filters state
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [priceRange, setPriceRange] = useState<[number, number]>([minProductPrice, maxProductPrice]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory);
  const [minRating, setMinRating] = useState<number | null>(null);
  
  // View state
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mobile filters sheet
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Sync state with URL params on mount
  useEffect(() => {
    setSearchQuery(initialQuery);
    if (initialCategory.length > 0) {
      setSelectedCategories(initialCategory);
    }
  }, [initialQuery, initialCategory]);

  // Handle fake loading state
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [searchQuery, priceRange, selectedBrands, selectedCategories, minRating, sortBy, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, priceRange, selectedBrands, selectedCategories, minRating, sortBy]);

  // Derived filtered & sorted data
  const processedProducts = useMemo(() => {
    let result = [...ALL_PRODUCTS];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Category
    if (selectedCategories.length > 0) {
      result = result.filter(p => p.category && selectedCategories.includes(p.category));
    }

    // Brand
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    // Price
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Rating
    if (minRating !== null) {
      result = result.filter(p => p.rating >= minRating);
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // Fake newest: sort by ID reverse
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'featured':
      default:
        // Keep default order (which is a mix of featured and deals)
        break;
    }

    return result;
  }, [searchQuery, selectedCategories, selectedBrands, priceRange, minRating, sortBy]);

  // Pagination
  const totalItems = processedProducts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedProducts = processedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  const activeFiltersCount = 
    (selectedBrands.length > 0 ? 1 : 0) + 
    (selectedCategories.length > 0 ? 1 : 0) + 
    (minRating !== null ? 1 : 0) + 
    (priceRange[0] > minProductPrice || priceRange[1] < maxProductPrice ? 1 : 0);

  const handleClearFilters = () => {
    setSearchQuery('');
    setPriceRange([minProductPrice, maxProductPrice]);
    setSelectedBrands([]);
    setSelectedCategories([]);
    setMinRating(null);
    // Remove query params
    setLocation('/products');
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const FiltersContent = () => (
    <div className="space-y-8">
      {/* Search */}
      <div>
        <h3 className="text-sm font-semibold mb-3 tracking-wider uppercase text-muted-foreground">Search</h3>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..." 
            className="pl-9 bg-muted/50 border-transparent focus-visible:bg-background"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold mb-3 tracking-wider uppercase text-muted-foreground">Categories</h3>
        <div className="space-y-2.5 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {allCategories.map(cat => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <Checkbox 
                checked={selectedCategories.includes(cat)}
                onCheckedChange={() => toggleCategory(cat)}
                className="rounded-[4px]"
              />
              <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground">Price Range</h3>
          <span className="text-xs font-medium text-foreground bg-muted px-2 py-0.5 rounded">
            ${priceRange[0]} - ${priceRange[1]}
          </span>
        </div>
        <Slider 
          min={minProductPrice}
          max={maxProductPrice}
          step={5}
          value={priceRange}
          onValueChange={(val) => setPriceRange(val as [number, number])}
          className="my-4"
        />
      </div>

      {/* Brands */}
      <div>
        <h3 className="text-sm font-semibold mb-3 tracking-wider uppercase text-muted-foreground">Brands</h3>
        <div className="space-y-2.5 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {allBrands.map(brand => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
              <Checkbox 
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
                className="rounded-[4px]"
              />
              <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-sm font-semibold mb-3 tracking-wider uppercase text-muted-foreground">Rating</h3>
        <div className="space-y-2.5">
          {[4, 3, 2, 1].map(rating => (
            <label key={rating} className="flex items-center gap-3 cursor-pointer group">
              <Checkbox 
                checked={minRating === rating}
                onCheckedChange={() => setMinRating(minRating === rating ? null : rating)}
                className="rounded-[4px]"
              />
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3.5 h-3.5 ${i < rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} 
                  />
                ))}
                <span className="text-sm font-medium ml-1 text-foreground/80">& Up</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full flex-1 flex flex-col bg-background">
      {/* Page Header */}
      <div className="bg-secondary/30 border-b border-border py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <h1 className="font-display font-bold text-3xl md:text-5xl text-foreground mb-4">
              All Products
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed">
              Explore our curated selection of premium products. Filter by category, brand, or price to find exactly what you're looking for.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-10 flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 sticky top-28 h-[calc(100vh-8rem)] overflow-y-auto pb-10 pr-6 custom-scrollbar">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <div className="flex items-center gap-2 font-display font-bold text-lg">
              <Filter className="w-5 h-5" />
              Filters {activeFiltersCount > 0 && <span className="bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">{activeFiltersCount}</span>}
            </div>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleClearFilters} className="h-8 text-xs font-semibold text-muted-foreground hover:text-foreground">
                Clear All
              </Button>
            )}
          </div>
          <FiltersContent />
        </aside>

        {/* Main Content */}
        <div className="flex-1 w-full min-w-0 flex flex-col">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="text-sm font-medium text-muted-foreground">
              Showing <span className="text-foreground font-bold">{totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="text-foreground font-bold">{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}</span> of <span className="text-foreground font-bold">{totalItems}</span> products
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden flex items-center gap-2 h-10 font-semibold bg-background">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full sm:max-w-md p-0 flex flex-col">
                  <SheetHeader className="p-6 border-b border-border text-left">
                    <div className="flex items-center justify-between">
                      <SheetTitle className="font-display text-xl flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Filters
                      </SheetTitle>
                      {activeFiltersCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-muted-foreground">
                          Clear
                        </Button>
                      )}
                    </div>
                  </SheetHeader>
                  <div className="p-6 flex-1 overflow-y-auto">
                    <FiltersContent />
                  </div>
                  <SheetFooter className="p-6 border-t border-border bg-card">
                    <SheetClose asChild>
                      <Button className="w-full h-12 text-base font-semibold">
                        Show {totalItems} Results
                      </Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">Sort by:</span>
                <Select value={sortBy} onValueChange={(val) => setSortBy(val as SortOption)}>
                  <SelectTrigger className="w-[160px] h-10 bg-background font-medium border-border">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest Arrivals</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {searchQuery && (
                <div className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium border border-border">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="ml-1 text-muted-foreground hover:text-foreground"><X className="w-3 h-3" /></button>
                </div>
              )}
              {selectedCategories.map(cat => (
                <div key={cat} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium border border-border">
                  {cat}
                  <button onClick={() => toggleCategory(cat)} className="ml-1 text-muted-foreground hover:text-foreground"><X className="w-3 h-3" /></button>
                </div>
              ))}
              {selectedBrands.map(brand => (
                <div key={brand} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium border border-border">
                  {brand}
                  <button onClick={() => toggleBrand(brand)} className="ml-1 text-muted-foreground hover:text-foreground"><X className="w-3 h-3" /></button>
                </div>
              ))}
              {minRating !== null && (
                <div className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium border border-border">
                  {minRating}+ Stars
                  <button onClick={() => setMinRating(null)} className="ml-1 text-muted-foreground hover:text-foreground"><X className="w-3 h-3" /></button>
                </div>
              )}
              {(priceRange[0] > minProductPrice || priceRange[1] < maxProductPrice) && (
                <div className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium border border-border">
                  ${priceRange[0]} - ${priceRange[1]}
                  <button onClick={() => setPriceRange([minProductPrice, maxProductPrice])} className="ml-1 text-muted-foreground hover:text-foreground"><X className="w-3 h-3" /></button>
                </div>
              )}
            </div>
          )}

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <Skeleton className="w-full aspect-[4/5] rounded-2xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-10 w-full mt-2" />
                </div>
              ))}
            </div>
          ) : paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {paginatedProducts.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                  >
                    <ProductCard 
                      {...product} 
                      onAddToCart={() => handleAddToCart(product)}
                      onToggleWishlist={(isAdded) => onToggleWishlist(product, isAdded)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-muted/30 rounded-2xl border border-dashed border-border mt-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <SearchIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-display font-bold text-2xl mb-2">No products found</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                We couldn't find any products matching your current filters. Try adjusting your search or removing some filters.
              </p>
              <Button onClick={handleClearFilters} size="lg" className="rounded-full px-8 font-semibold">
                Clear All Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && !isLoading && (
            <div className="mt-16 pt-8 border-t border-border flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    // Show first, last, current, and adjacent pages
                    if (
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink 
                            isActive={currentPage === page}
                            onClick={() => setCurrentPage(page)}
                            className="cursor-pointer font-medium"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    
                    // Show ellipsis
                    if (
                      (page === 2 && currentPage > 3) || 
                      (page === totalPages - 1 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    
                    return null;
                  })}

                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
