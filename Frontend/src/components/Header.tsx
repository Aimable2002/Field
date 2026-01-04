import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, ClipboardList, LayoutDashboard, Users, Menu, BellPlusIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Sheet, SheetHeader, SheetContent as SheetContentUI, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SetupInitialData } from '@/components/SetupInitialData';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated) return null;

  const navItems = [
    { to: '/', label: 'Survey', icon: ClipboardList },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/performance', label: 'Analytic Metrics', icon: BellPlusIcon },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <ClipboardList className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">FieldPulse</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to}>
                <Button 
                  variant={location.pathname === item.to ? 'secondary' : 'ghost'} 
                  size="sm"
                  className="gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-4">
          {/* Add Initialize Data Button */}
          <SetupInitialData />
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">{user?.teamName}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{user?.name}</span>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContentUI side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                    <ClipboardList className="h-5 w-5 text-primary-foreground" />
                  </div>
                  FieldPulse
                </SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 space-y-4">
                {/* Team Badge */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">{user?.teamName}</span>
                </div>

                {/* User Info */}
                <div className="px-3 py-2">
                  <p className="text-sm text-muted-foreground">Logged in as</p>
                  <p className="font-medium">{user?.name}</p>
                </div>

                {/* Initialize Data Button for Mobile */}
                <div className="px-2">
                  <SetupInitialData />
                </div>

                {/* Navigation */}
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <Link key={item.to} to={item.to} onClick={() => setIsOpen(false)}>
                      <Button 
                        variant={location.pathname === item.to ? 'secondary' : 'ghost'} 
                        className="w-full justify-start gap-2"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                </nav>

                {/* Logout */}
                <div className="pt-4 border-t border-border">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContentUI>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;