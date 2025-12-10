import { useEffect, useState } from 'react';
import { Home, FileText, MessageSquare, Bell, ArrowRight, Calendar, MapPin } from 'lucide-react';
import { DashboardLayout } from '../layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { Page } from '../../App';

interface DashboardEtudiantProps {
  navigate: (page: Page) => void;
  onLogout: () => void;
}

interface AffectationInfo {
  chambreNumero: string;
  chambreType: string;
  dateDebut: string;
  dateFin: string | null;
}

interface NotificationItem {
  id: number;
  type: string;
  titre: string;
  message: string;
  date: string;
  lu: boolean;
}

interface ReclamationItem {
  id: number;
  message: string;
  dateEnvoi: string;
  status?: string;
}

export function DashboardEtudiant({ navigate }: DashboardEtudiantProps) {
  const [userName, setUserName] = useState('Étudiant');
  const [verifying, setVerifying] = useState(true);

  const [demandesEnCours, setDemandesEnCours] = useState<number>(0);
  const [nbReclamations, setNbReclamations] = useState<number>(0);
  const [nbNotifications, setNbNotifications] = useState<number>(0);
  const [affectation, setAffectation] = useState<AffectationInfo | null>(null);
  const [recentNotifications, setRecentNotifications] = useState<NotificationItem[]>([]);
  const [recentReclamations, setRecentReclamations] = useState<ReclamationItem[]>([]);

  const API_BASE = 'http://localhost:8080';

  // ✅ Déconnexion
  const handleLogout = () => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE}/api/auth/logout?token=${token}`, { method: 'POST' })
      .finally(() => {
        localStorage.clear();
        navigate('landing');
      });
  };

  // 🔹 Charge les stats du tableau de bord
  const loadDashboardData = async (token: string) => {
    try {
      // Demandes en cours
      const resDemandes = await fetch(`${API_BASE}/api/etudiants/me/demandes/count-en-cours`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resDemandes.ok) {
        const data = await resDemandes.json();
        setDemandesEnCours(data.count ?? 0);
      }

      // Réclamations
      const resRecs = await fetch(`${API_BASE}/api/reclamations/me/count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resRecs.ok) {
        const data = await resRecs.json();
        setNbReclamations(data.count ?? 0);
      }

      // Affectation actuelle
      const resAff = await fetch(`${API_BASE}/api/etudiants/me/affectation`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Affectation actuelle
      if (resAff.ok) {
        const data = await resAff.json();

        // Support both possible backend formats:
       // 1) DTO: chambreNumero, chambreType
       // 2) Raw entity: chambre.numero, chambre.type

       const chambreNumero =
        data.chambreNumero ?? data.chambre?.numero ?? null;

       const chambreType =
         data.chambreType ?? data.chambre?.type ?? null;

       setAffectation({
        chambreNumero,
        chambreType,
        dateDebut: data.dateDebut,
        dateFin: data.dateFin ?? null,
      });
      } else {
        setAffectation(null);
      }


      // Notifications : stats + liste récente
      const resNotifStats = await fetch(`${API_BASE}/api/notifications/me/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resNotifStats.ok) {
        const data = await resNotifStats.json();
        // On affiche le nombre de notifications non lues
        setNbNotifications(data.unread ?? 0);
      }

      const resNotifList = await fetch(`${API_BASE}/api/notifications/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resNotifList.ok) {
        const list = await resNotifList.json();
        setRecentNotifications(list.slice(0, 3));
      }

      // Réclamations récentes
      const resReclamations = await fetch(`${API_BASE}/api/reclamations/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resReclamations.ok) {
        const list = await resReclamations.json();
        setRecentReclamations(list.slice(0, 3));
      }
    } catch (err) {
      console.error('Erreur lors du chargement des données du dashboard:', err);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      alert('Session expirée. Veuillez vous reconnecter.');
      navigate('landing');
      return;
    }

    const user = JSON.parse(storedUser);
    if (user.nom && user.prenom) {
      setUserName(`${user.prenom} ${user.nom}`);
    }

    fetch(`${API_BASE}/api/auth/verify?token=${token}`)
      .then((res) => {
        if (!res.ok) throw new Error('Token invalide');
        setVerifying(false);
        return loadDashboardData(token);
      })
      .catch(() => {
        localStorage.clear();
        alert('Session expirée. Veuillez vous reconnecter.');
        navigate('landing');
      });
  }, [navigate]);

  // ✅ Écran de chargement pendant la vérification
  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Vérification de la session...</p>
      </div>
    );
  }

  return (
    <DashboardLayout
      userName={userName}
      userRole="ETUDIANT"
      navigate={navigate}
      onLogout={handleLogout}
    >
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Bienvenue, {userName}</h1>
          <p className="text-gray-600">
            Voici un aperçu de votre espace étudiant
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Demandes en cours</p>
                  <p className="text-2xl">{demandesEnCours}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Affectation actuelle</p>
                  <p className="text-2xl">
                    {affectation ? `Chambre ${affectation.chambreNumero}` : '—'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Réclamations</p>
                  <p className="text-2xl">{nbReclamations}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Notifications</p>
                  <p className="text-2xl">{nbNotifications}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Faire une demande */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Faire une demande d'hébergement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Soumettez une nouvelle demande d'hébergement pour le semestre prochain
              </p>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate('demande-hebergement')}
              >
                Nouvelle demande
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Mes affectations */}
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate('chambre-details')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5 text-green-600" />
                Mes affectations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {affectation ? (
                <>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Chambre actuelle</span>
                      <span>
                        {affectation.chambreNumero}
                        {' - '}
                        {affectation.chambreType}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Période</span>
                      <span>
                        {new Date(affectation.dateDebut).toLocaleDateString('fr-FR')} -{' '}
                        {affectation.dateFin
                          ? new Date(affectation.dateFin).toLocaleDateString('fr-FR')
                          : '—'}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Voir les détails
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-gray-600 mb-4">
                    Vous n'avez pas encore d'affectation enregistrée dans le système.
                  </p>
                  <Button variant="outline" className="w-full" disabled>
                    Aucune affectation disponible
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Réclamations et Notifications */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Mes réclamations */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-orange-600" />
                  Mes réclamations
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('reclamation')}
                >
                  Voir tout
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentReclamations.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  Vous n'avez pas de réclamations récentes.
                </p>
              ) : (
                <div className="space-y-3">
                  {recentReclamations.map((rec) => (
                    <div
                      key={rec.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <MessageSquare className="w-4 h-4 text-orange-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm text-gray-700">{rec.message}</p>
                          <Badge
                            className={
                              rec.status === "EN_ATTENTE"
                                ? "bg-yellow-100 text-yellow-800 text-xs"
                                : rec.status === "EN_COURS"
                                ? "bg-blue-100 text-blue-800 text-xs"
                                : rec.status === "RESOLUE"
                                ? "bg-green-100 text-green-800 text-xs"
                                : "bg-yellow-100 text-yellow-800 text-xs"
                            }
                          >
                            {rec.status === "EN_ATTENTE"
                              ? "En attente"
                              : rec.status === "EN_COURS"
                              ? "En cours"
                              : rec.status === "RESOLUE"
                              ? "Résolue"
                              : "Envoyée"}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(rec.dateEnvoi).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Button
                className="w-full mt-4 bg-orange-600 hover:bg-orange-700"
                onClick={() => navigate('reclamation')}
              >
                Nouvelle réclamation
              </Button>
            </CardContent>
          </Card>

          {/* Notifications récentes */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-purple-600" />
                  Notifications récentes
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('notifications')}
                >
                  Voir tout
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentNotifications.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  Vous n'avez pas de notifications récentes.
                </p>
              ) : (
                <div className="space-y-4">
                  {recentNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <Calendar className="w-4 h-4 text-gray-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm mb-1">{notif.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(notif.date).toLocaleString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
