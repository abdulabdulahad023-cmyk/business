import { useState } from 'react';
import { Menu, Search, ChevronDown } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'wouter';
import { NAVBAR_MOCK_CATEGORIES } from '@/lib/mock-data';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (title: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="md:hidden p-2 -ml-2 text-foreground hover:bg-muted rounded-full transition-colors">
          <Menu className="w-6 h-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85vw] sm:max-w-md p-0 flex flex-col overflow-hidden border-r-0">
        <SheetHeader className="p-4 border-b border-border text-left sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>
        
        <div className="p-4 bg-muted/30">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input 
              type="search" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 bg-background border-border rounded-full h-11"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2">
              Shop Categories
            </div>
            {NAVBAR_MOCK_CATEGORIES.map((category) => (
              <Collapsible 
                key={category.title} 
                open={openCategories[category.title]} 
                onOpenChange={() => toggleCategory(category.title)}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between font-semibold px-2 py-6 h-auto">
                    {category.title}
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openCategories[category.title] ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 py-2 flex flex-col gap-3 border-l-2 border-muted ml-4 mt-1 mb-2">
                  <Link href={category.href}>
                    <span onClick={() => setIsOpen(false)} className="text-sm font-medium hover:text-primary transition-colors block">
                      Shop All {category.title}
                    </span>
                  </Link>
                  {category.subcategories.map(sub => (
                    <Link key={sub.name} href={sub.href}>
                      <span onClick={() => setIsOpen(false)} className="text-sm text-muted-foreground hover:text-primary transition-colors block">
                        {sub.name}
                      </span>
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
          
          <div className="h-px bg-border my-2" />
          
          <div className="space-y-2 px-2 flex flex-col">
            <Link href="/new-arrivals">
              <span onClick={() => setIsOpen(false)} className="font-semibold py-2 block">New Arrivals</span>
            </Link>
            <Link href="/brands">
              <span onClick={() => setIsOpen(false)} className="font-semibold py-2 block">Brands</span>
            </Link>
            <Link href="/daily-deals">
              <span onClick={() => setIsOpen(false)} className="font-semibold py-2 block text-destructive">Daily Deals</span>
            </Link>
          </div>
        </div>

        <div className="p-4 border-t border-border bg-muted/10 grid grid-cols-2 gap-2">
          <Button variant="outline" className="w-full rounded-full" onClick={() => setIsOpen(false)}>
            Sign In
          </Button>
          <Button className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setIsOpen(false)}>
            Create Account
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
