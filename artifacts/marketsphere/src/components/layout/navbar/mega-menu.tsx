import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from '@/components/ui/navigation-menu';
import { NAVBAR_MOCK_CATEGORIES } from '@/lib/mock-data';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';

export function MegaMenu() {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent h-11 px-4 text-sm font-semibold tracking-wide text-foreground/80 hover:text-foreground data-[state=open]:bg-transparent data-[state=open]:text-primary hover:bg-transparent">
            Shop
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[800px] p-6 grid grid-cols-4 gap-6 bg-card border-border">
              {NAVBAR_MOCK_CATEGORIES.map((category) => (
                <div key={category.title} className="flex flex-col gap-4">
                  <Link href={category.href}>
                    <div className="group block cursor-pointer">
                      <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                        <img 
                          src={category.image} 
                          alt={category.title} 
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                      </div>
                      <div className="flex items-center gap-1 font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                        {category.title}
                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </div>
                    </div>
                  </Link>
                  
                  <ul className="flex flex-col gap-2">
                    {category.subcategories.map((sub) => (
                      <li key={sub.name}>
                        <Link href={sub.href}>
                          <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer inline-block">
                            {sub.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link href="/new-arrivals">
            <span className="group inline-flex h-11 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-semibold tracking-wide text-foreground/80 transition-colors hover:text-foreground hover:bg-transparent cursor-pointer">
              New Arrivals
            </span>
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link href="/brands">
            <span className="group inline-flex h-11 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-semibold tracking-wide text-foreground/80 transition-colors hover:text-foreground hover:bg-transparent cursor-pointer">
              Brands
            </span>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
