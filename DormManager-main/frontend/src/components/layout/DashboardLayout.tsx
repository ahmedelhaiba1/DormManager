import { Building2, Bell, LogOut, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { Page } from '../../App';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userName: string;
  userRole: string;
  navigate: (page: Page) => void;
  onLogout: () => void;
}

export function DashboardLayout({ children, userName, userRole, navigate, onLogout }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl">DormManager</span>
                <p className="text-xs text-gray-500">{userRole}</p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => navigate('notifications')}
              >
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500">
                  3
                </Badge>
              </Button>

              {/* User menu */}
              <div className="flex items-center gap-3 pl-4 border-l">
                <div className="text-right">
                  <p className="text-sm">{userName}</p>
                  <p className="text-xs text-gray-500">{userRole}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
              </div>

              {/* Logout */}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onLogout}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}
