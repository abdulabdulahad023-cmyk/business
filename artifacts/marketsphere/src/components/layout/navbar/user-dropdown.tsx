import { User, LogIn, Settings, ShoppingBag, HelpCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/lib/auth-context';
import { useLocation } from 'wouter';

export function UserDropdown() {
  const { isAuthenticated, user, logout } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full relative text-foreground/80 hover:text-foreground hidden sm:inline-flex">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl p-2">
        {isAuthenticated ? (
          <>
            <DropdownMenuLabel className="font-display">
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium leading-none">{user?.name}</span>
                <span className="text-xs leading-none text-muted-foreground">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer py-2" onClick={() => setLocation('/account')}>
              <User className="w-4 h-4 mr-2" />
              <span>My Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer py-2">
              <ShoppingBag className="w-4 h-4 mr-2" />
              <span>Orders & Returns</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer py-2">
              <Settings className="w-4 h-4 mr-2" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer py-2">
              <HelpCircle className="w-4 h-4 mr-2" />
              <span>Help & Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer py-2 text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => {
              logout();
              setLocation('/');
            }}>
              <LogOut className="w-4 h-4 mr-2" />
              <span>Log Out</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel className="font-display">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer py-2" onClick={() => setLocation('/login')}>
              <LogIn className="w-4 h-4 mr-2" />
              <span>Sign In</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer py-2" onClick={() => setLocation('/register')}>
              <User className="w-4 h-4 mr-2" />
              <span>Create Account</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer py-2">
              <HelpCircle className="w-4 h-4 mr-2" />
              <span>Help & Support</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
