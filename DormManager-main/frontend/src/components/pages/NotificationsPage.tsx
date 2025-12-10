import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  MessageSquare,
  Calendar,
  ArrowLeft,
  Check,
} from "lucide-react";
import { DashboardLayout } from "../layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";
import type { Page } from "../../App";

interface NotificationsPageProps {
  navigate: (page: Page) => void;
  onLogout: () => void;
}

export function NotificationsPage({
  navigate,
  onLogout,
}: NotificationsPageProps) {
  const notifications = [
    {
      id: 1,
      type: "success",
      titre: "Demande d'hébergement validée",
      message:
        "Votre demande d'hébergement pour le semestre d'hiver a été validée. Vous serez logé en chambre 205.",
      date: "2024-11-08 10:30",
      lu: false,
    },
    {
      id: 2,
      type: "info",
      titre: "Maintenance programmée",
      message:
        "Une maintenance préventive est prévue dans votre bâtiment le 15/11 de 9h à 12h. L'eau sera coupée pendant cette période.",
      date: "2024-11-07 14:15",
      lu: false,
    },
    {
      id: 3,
      type: "message",
      titre: "Réponse à votre réclamation",
      message:
        "L'administration a répondu à votre réclamation concernant le chauffage. Un technicien interviendra demain.",
      date: "2024-11-06 16:45",
      lu: false,
    },
    {
      id: 4,
      type: "info",
      titre: "Événement résidence",
      message:
        "Soirée d'accueil des nouveaux résidents le 20/11 à 19h dans la salle commune.",
      date: "2024-11-05 09:00",
      lu: true,
    },
    {
      id: 5,
      type: "warning",
      titre: "Paiement en attente",
      message:
        "Votre paiement du loyer pour le mois de novembre est en attente. Veuillez régulariser votre situation.",
      date: "2024-11-03 11:20",
      lu: true,
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return (
          <CheckCircle className="w-5 h-5 text-green-600" />
        );
      case "warning":
        return (
          <AlertTriangle className="w-5 h-5 text-orange-600" />
        );
      case "message":
        return (
          <MessageSquare className="w-5 h-5 text-blue-600" />
        );
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getNotificationBgColor = (
    type: string,
    lu: boolean,
  ) => {
    if (lu) return "bg-gray-50";
    switch (type) {
      case "success":
        return "bg-green-50 border-l-4 border-green-600";
      case "warning":
        return "bg-orange-50 border-l-4 border-orange-600";
      case "message":
        return "bg-blue-50 border-l-4 border-blue-600";
      default:
        return "bg-blue-50 border-l-4 border-blue-600";
    }
  };

  const notificationsNonLues = notifications.filter(
    (n) => !n.lu,
  );
  const notificationsLues = notifications.filter((n) => n.lu);

  return (
    <DashboardLayout
      userName="Jean Dupont"
      userRole="Étudiant"
      navigate={navigate}
      onLogout={onLogout} 
    >
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("dashboard-etudiant")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au dashboard
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl mb-2">Notifications</h1>
              <p className="text-gray-600">
                Restez informé de toutes les mises à jour
              </p>
            </div>
            <Button variant="outline">
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
                  <p className="text-sm text-gray-600">
                    Non lues
                  </p>
                  <p className="text-2xl">
                    {notificationsNonLues.length}
                  </p>
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
                  <p className="text-sm text-gray-600">
                    Aujourd'hui
                  </p>
                  <p className="text-2xl">2</p>
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
                  <p className="text-2xl">
                    {notifications.length}
                  </p>
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
                        className={`p-4 rounded-lg transition-all cursor-pointer hover:shadow-md ${getNotificationBgColor(notif.type, notif.lu)}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {getNotificationIcon(notif.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="pr-4">
                                {notif.titre}
                              </h3>
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
                                {notif.date}
                              </p>
                              <Button size="sm" variant="ghost">
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
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 rounded-lg transition-all cursor-pointer hover:shadow-md ${getNotificationBgColor(notif.type, notif.lu)}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {getNotificationIcon(notif.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3
                              className={`pr-4 ${notif.lu ? "text-gray-600" : ""}`}
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
                            className={`text-sm mb-2 ${notif.lu ? "text-gray-500" : "text-gray-700"}`}
                          >
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {notif.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="mb-1">
                  Paramètres de notification
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  Vous pouvez personnaliser vos préférences de
                  notification dans les paramètres de votre
                  compte.
                </p>
                <Button size="sm" variant="outline">
                  Gérer les préférences
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}