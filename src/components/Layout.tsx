
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LayoutDashboard, 
  Users, 
  PieChart,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon, label, href, active, onClick }: NavItemProps) => (
  <Button
    asChild
    variant={active ? "secondary" : "ghost"}
    className="w-full justify-start"
    onClick={onClick}
  >
    <Link to={href}>
      {icon}
      <span className="ml-2">{label}</span>
    </Link>
  </Button>
);

export const Layout = ({ children }: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const pathname = window.location.pathname;
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  const navItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard", href: "/dashboard" },
    { icon: <Users className="h-5 w-5" />, label: "Leads", href: "/leads" },
    { icon: <PieChart className="h-5 w-5" />, label: "Pipeline", href: "/pipeline" },
    { icon: <SettingsIcon className="h-5 w-5" />, label: "Settings", href: "/settings" },
  ];
  
  const renderNavItems = (onClick?: () => void) => (
    <div className="space-y-2">
      {navItems.map((item) => (
        <NavItem
          key={item.href}
          icon={item.icon}
          label={item.label}
          href={item.href}
          active={pathname === item.href}
          onClick={onClick}
        />
      ))}
    </div>
  );
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-64 bg-white border-r p-4">
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
            LM
          </div>
          <h1 className="text-xl font-bold ml-2">LeadManager</h1>
        </div>
        
        {renderNavItems()}
        
        <div className="mt-auto">
          <Separator className="my-4" />
          <div className="flex items-center p-2">
            <Avatar className="h-9 w-9">
              <AvatarFallback>AU</AvatarFallback>
            </Avatar>
            <div className="ml-2">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white border-b lg:hidden">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                LM
              </div>
              <h1 className="text-lg font-bold ml-2">LeadManager</h1>
            </div>
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        LM
                      </div>
                      <h1 className="text-lg font-bold ml-2">LeadManager</h1>
                    </div>
                    <Button variant="ghost" size="icon" onClick={closeMobileMenu}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  {renderNavItems(closeMobileMenu)}
                  
                  <Separator className="my-4" />
                  <div className="flex items-center p-2">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>AU</AvatarFallback>
                    </Avatar>
                    <div className="ml-2">
                      <p className="text-sm font-medium">Admin User</p>
                      <p className="text-xs text-gray-500">admin@example.com</p>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};
