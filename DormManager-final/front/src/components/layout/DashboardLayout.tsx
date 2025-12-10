import { Building2, Bell, LogOut, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { Page } from '../../App';
import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:8081';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userName: string;
  userRole: string;
  navigate: (page: Page) => void;
  onLogout: () => void;
}

export function DashboardLayout({ children, userName, userRole, navigate, onLogout }: DashboardLayoutProps) {
    const [nbNotifications, setNbNotifications] = useState<number>(0);
    const [systemName, setSystemName] = useState<string>('DormManager');

    useEffect(() => {
      // Load system name from localStorage
      const storedSystemName = localStorage.getItem('systemName');
      if (storedSystemName) {
        setSystemName(storedSystemName);
      }

      // Listen for system name changes from parameters tab
      const handleSystemNameChange = (e: any) => {
        if (e.detail) {
          setSystemName(e.detail);
        }
      };

      window.addEventListener('systemNameChanged', handleSystemNameChange);
      return () => window.removeEventListener('systemNameChanged', handleSystemNameChange);
    }, []);

    useEffect(() => {
      // initial fetch of unread notifications
      const token = localStorage.getItem('token');
      if (!token) return;
      fetch(`${API_BASE}/api/notifications/me/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setNbNotifications(data.unread || 0);
          // store in localStorage so other components can listen
          try { localStorage.setItem('notifications-unread', String(data.unread || 0)); } catch(e) {}
        })
        .catch(() => {});

      // listen for storage events (when NotificationsPage updates unread count)
      const onStorage = (e: StorageEvent) => {
        if (e.key === 'notifications-unread') {
          setNbNotifications(Number(e.newValue) || 0);
        }
      };
      const onCustom = (e: any) => {
        if (e && e.detail != null) setNbNotifications(Number(e.detail) || 0);
      };
      window.addEventListener('storage', onStorage);
      window.addEventListener('notifications-updated', onCustom as EventListener);
      return () => {
        window.removeEventListener('storage', onStorage);
        window.removeEventListener('notifications-updated', onCustom as EventListener);
      };
    }, []);

  return (
    <div className="min-h-screen bg-gray-50 relative z-0">
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
                <span className="text-xl">{systemName}</span>
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
                {nbNotifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500">
                    {nbNotifications}
                  </Badge>
                )}
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
