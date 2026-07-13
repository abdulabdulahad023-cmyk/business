import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/lib/auth-context';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Home } from '@/pages/home';
import { CartItem, WishlistItem, Product } from '@/types';

import { Products } from '@/pages/products';
import { ProductDetail } from '@/pages/product-detail';
import { Login } from '@/pages/login';
import { Register } from '@/pages/register';
import { ForgotPassword } from '@/pages/forgot-password';
import { ResetPassword } from '@/pages/reset-password';
import { Account } from '@/pages/account';
import { Cart } from '@/pages/cart';

const queryClient = new QueryClient();

function Router({ 
  onToggleWishlist
}: { 
  onToggleWishlist: (p: Product, isAdded: boolean) => void;
}) {
  return (
    <Switch>
      <Route path="/">
        <Home 
          onToggleWishlist={onToggleWishlist} 
        />
      </Route>
      <Route path="/products">
        <Products 
          onToggleWishlist={onToggleWishlist} 
        />
      </Route>
      <Route path="/product/:id">
        {(params) => (
          <ProductDetail 
            id={params.id}
            onToggleWishlist={onToggleWishlist} 
          />
        )}
      </Route>
      <Route path="/cart" component={Cart} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/account" component={Account} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout({ 
  children, 
  wishlistItems 
}: { 
  children: React.ReactNode; 
  wishlistItems: WishlistItem[]; 
}) {
  const [location] = useLocation();
  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].includes(location);

  return (
    <div className="flex flex-col min-h-[100dvh]">
      {!isAuthPage && <Navbar wishlistItems={wishlistItems} />}
      <main className={`flex-1 flex flex-col ${!isAuthPage ? 'pt-24' : ''}`}>
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  const handleToggleWishlist = (product: Product, isAdded: boolean) => {
    if (isAdded) {
      setWishlistItems(prev => {
        if (!prev.find(item => item.id === product.id)) {
          return [...prev, product];
        }
        return prev;
      });
    } else {
      setWishlistItems(prev => prev.filter(item => item.id !== product.id));
    }
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="marketsphere-theme">
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              <AppLayout wishlistItems={wishlistItems}>
                <Router 
                  onToggleWishlist={handleToggleWishlist}
                />
              </AppLayout>
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
