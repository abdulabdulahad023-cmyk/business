import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { ProtectedRoute } from '@/components/protected-route';
import { LogOut, User, Mail, Settings, Shield, CreditCard, MapPin } from 'lucide-react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';

export function Account() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  return (
    <ProtectedRoute>
      <div className="flex-1 w-full bg-background flex flex-col py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-[1200px]">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            
            {/* Sidebar */}
            <aside className="w-full md:w-64 lg:w-72 shrink-0">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-xl">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg">{user?.name}</h2>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              
              <nav className="space-y-1">
                <Button variant="ghost" className="w-full justify-start font-medium bg-secondary/50 text-foreground">
                  <User className="w-5 h-5 mr-3" /> Account Details
                </Button>
                <Button variant="ghost" className="w-full justify-start font-medium text-muted-foreground hover:text-foreground">
                  <MapPin className="w-5 h-5 mr-3" /> Saved Addresses
                </Button>
                <Button variant="ghost" className="w-full justify-start font-medium text-muted-foreground hover:text-foreground">
                  <CreditCard className="w-5 h-5 mr-3" /> Payment Methods
                </Button>
                <Button variant="ghost" className="w-full justify-start font-medium text-muted-foreground hover:text-foreground">
                  <Shield className="w-5 h-5 mr-3" /> Security
                </Button>
                <Button variant="ghost" className="w-full justify-start font-medium text-muted-foreground hover:text-foreground">
                  <Settings className="w-5 h-5 mr-3" /> Preferences
                </Button>
                <div className="pt-4 mt-4 border-t border-border">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start font-medium text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-5 h-5 mr-3" /> Log Out
                  </Button>
                </div>
              </nav>
            </aside>
            
            {/* Main Content Placeholder */}
            <div className="flex-1">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="font-display font-bold text-3xl mb-6">Account Details</h1>
                
                <div className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Full Name</label>
                        <div className="font-medium text-foreground flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          {user?.name}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Email Address</label>
                        <div className="font-medium text-foreground flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {user?.email}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-border">
                    <Button variant="outline" className="font-semibold">Edit Profile</Button>
                  </div>
                </div>
              </motion.div>
            </div>
            
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
