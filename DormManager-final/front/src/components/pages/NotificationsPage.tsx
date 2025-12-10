import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  MessageSquare,
  Calendar,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '../layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import type { Page } from '../../App';

interface NotificationsPageProps {
  navigate: (page: Page) => void;
  onLogout: () => void;
}

interface NotificationItem {
  id: number;
  type: string;
  titre: string;
  message: string;
  date: string;
  lu: boolean;
}

export function NotificationsPage({ navigate, onLogout }: NotificationsPageProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [stats, setStats] = useState<{ unread: number; total: number }>({
    unread: 0,
    total: 0,
  });
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [userName, setUserName] = useState('');
  const [verifying, setVerifying] = useState(true);
  const role = storedUser.role;

  const API_BASE = 'http://localhost:8080';

  const extractUserAndVerify = async () => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      alert('Session expirée. Veuillez vous reconnecter.');
      navigate('landing');
      return null;
    }

    const user = JSON.parse(storedUser);
    if (user.nom && user.prenom) {
      setUserName(`${user.prenom} ${user.nom}`);
    }

    const res = await fetch(`${API_BASE}/api/auth/verify?token=${token}`);
    if (!res.ok) {
      localStorage.clear();
      alert('Session expirée. Veuillez vous reconnecter.');
      navigate('landing');
      return null;
    }

    setVerifying(false);
    return token;
  };

  const goBackToDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  switch (user.role) {
    case 'ADMIN':
        navigate('dashboard-admin');
        break;
      case 'GESTIONNAIRE':
        navigate('dashboard-gestionnaire');
        break;
      case 'AGENT_TECHNIQUE':
        navigate('dashboard-agent');
        break;
      case 'ETUDIANT':
        navigate('dashboard-etudiant');
        break;
      default:
        alert('Unknown role');
  }
};

  const loadNotifications = async (token: string) => {
    const res = await fetch(`${API_BASE}/api/notifications/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setNotifications(data);
  };

  const loadStats = async (token: string) => {
    const res = await fetch(`${API_BASE}/api/notifications/me/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setStats(data);
    try {
      localStorage.setItem('notifications-unread', String(data.unread || 0));
      // Dispatch a custom event so other components in the same window can react
      window.dispatchEvent(new CustomEvent('notifications-updated', { detail: data.unread || 0 }));
    } catch (e) {}
  };

  useEffect(() => {
    (async () => {
      const token = await extractUserAndVerify();
      if (!token) return;
      await Promise.all([loadNotifications(token), loadStats(token)]);
    })();
  }, [navigate]);

  const markAsRead = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    await fetch(`${API_BASE}/api/notifications/${id}/read`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });

    await Promise.all([loadNotifications(token), loadStats(token)]);
  };

  const markAll = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    await fetch(`${API_BASE}/api/notifications/read-all`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });

    await Promise.all([loadNotifications(token), loadStats(token)]);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getNotificationBgColor = (type: string, lu: boolean) => {
    if (lu) return 'bg-gray-50';
    switch (type) {
      case 'success':
        return 'bg-green-50 border-l-4 border-green-600';
      case 'warning':
        return 'bg-orange-50 border-l-4 border-orange-600';
      case 'message':
        return 'bg-blue-50 border-l-4 border-blue-600';
      default:
        return 'bg-blue-50 border-l-4 border-blue-600';
    }
  };

  const notificationsNonLues = notifications.filter((n) => !n.lu);
  const notificationsLues = notifications.filter((n) => n.lu);

  // Count notifications from today
  const getTodayNotificationsCount = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day
    return notifications.filter((n) => {
      const notifDate = new Date(n.date);
      notifDate.setHours(0, 0, 0, 0); // Set to start of day
      return notifDate.getTime() === today.getTime();
    }).length;
  };

  const todayCount = getTodayNotificationsCount();

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Vérification de la session...</p>
      </div>
    );
  }

  return (
    <DashboardLayout
      userName={`${storedUser.prenom || ""} ${storedUser.nom || ""}`}
      userRole={storedUser.role}
      navigate={navigate}
      onLogout={onLogout}
    >
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-4"
          onClick={goBackToDashboard}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au dashboard
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl mb-2">Notifications</h1>
              <p className="text-gray-600">Restez informé de toutes les mises à jour</p>
            </div>
            <Button variant="outline" onClick={markAll}>
              <Check className="w-4 h-4 mr-2" />
              Tout marquer comme lu
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Non lues</p>
                  <p className="text-2xl">{stats.unread}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Aujourd'hui</p>
                  <p className="text-2xl">{todayCount}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl">{stats.total}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              Toutes les notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="non-lues">
              <TabsList className="mb-4">
                <TabsTrigger value="non-lues">
                  Non lues ({notificationsNonLues.length})
                </TabsTrigger>
                <TabsTrigger value="toutes">
                  Toutes ({notifications.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="non-lues">
                <div className="space-y-3">
                  {notificationsNonLues.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Bell className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>Aucune notification non lue</p>
                    </div>
                  ) : (
                    notificationsNonLues.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 rounded-lg transition-all cursor-pointer hover:shadow-md ${getNotificationBgColor(
                          notif.type,
                          notif.lu,
                        )}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">{getNotificationIcon(notif.type)}</div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="pr-4">{notif.titre}</h3>
                              {!notif.lu && (
                                <Badge className="bg-blue-600 text-white flex-shrink-0">
                                  Nouveau
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 mb-2">
                              {notif.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-gray-500">
                                {new Date(notif.date).toLocaleString('fr-FR')}
                              </p>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markAsRead(notif.id)}
                              >
                                Marquer comme lu
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="toutes">
                <div className="space-y-3">
                  {notificationsLues.length === 0 && notificationsNonLues.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Bell className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>Aucune notification à afficher</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 rounded-lg transition-all cursor-pointer hover:shadow-md ${getNotificationBgColor(
                          notif.type,
                          notif.lu,
                        )}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">{getNotificationIcon(notif.type)}</div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3
                                className={`pr-4 ${
                                  notif.lu ? 'text-gray-600' : ''
                                }`}
                              >
                                {notif.titre}
                              </h3>
                              {!notif.lu && (
                                <Badge className="bg-blue-600 text-white flex-shrink-0">
                                  Nouveau
                                </Badge>
                              )}
                            </div>
                            <p
                              className={`text-sm mb-2 ${
                                notif.lu ? 'text-gray-500' : 'text-gray-700'
                              }`}
                            >
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(notif.date).toLocaleString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
