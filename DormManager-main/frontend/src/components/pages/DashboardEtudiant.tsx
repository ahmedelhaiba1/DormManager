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

export function DashboardEtudiant({ navigate, onLogout }: DashboardEtudiantProps) {
  const [userName, setUserName] = useState('Étudiant');
  const [verifying, setVerifying] = useState(true);

  // ✅ Define logout handler INSIDE component
  const handleLogout = () => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8081/api/auth/logout?token=${token}`, { method: 'POST' })
      .finally(() => {
        localStorage.clear();
        navigate('landing');
      });
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

    // ✅ Only verify once (not every time we navigate)
    fetch(`http://localhost:8081/api/auth/verify?token=${token}`)
      .then((res) => {
        if (!res.ok) throw new Error('Token invalide');
        setVerifying(false);
      })
      .catch(() => {
        localStorage.clear();
        alert('Session expirée. Veuillez vous reconnecter.');
        navigate('landing');
      });
  }, [navigate]);

  // ✅ Show a loading screen while verifying
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
      userRole="Étudiant"
      navigate={navigate}
      onLogout={handleLogout}
    >
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2"><h1 className="text-3xl mb-2">Bienvenue, {userName}</h1>
          </h1>
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
                  <p className="text-2xl">1</p>
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
                  <p className="text-2xl">Chambre 205</p>
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
                  <p className="text-2xl">2</p>
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
                  <p className="text-2xl">3</p>
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
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Chambre actuelle</span>
                  <span>205 - Bâtiment A</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Type</span>
                  <span>Double</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Période</span>
                  <span>01/09/2024 - 30/06/2025</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Voir les détails
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
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
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm">Problème de chauffage</p>
                      <Badge className="bg-yellow-100 text-yellow-800">En cours</Badge>
                    </div>
                    <p className="text-xs text-gray-500">Il y a 2 jours</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm">Fuite d'eau dans la douche</p>
                      <Badge className="bg-green-100 text-green-800">Résolu</Badge>
                    </div>
                    <p className="text-xs text-gray-500">Il y a 1 semaine</p>
                  </div>
                </div>
              </div>
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
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                  <Calendar className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm mb-1">Votre demande d'hébergement a été validée</p>
                    <p className="text-xs text-gray-500">Il y a 3 heures</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-4 h-4 text-gray-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm mb-1">Maintenance prévue le 15/11</p>
                    <p className="text-xs text-gray-500">Il y a 1 jour</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-gray-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm mb-1">Réponse à votre réclamation</p>
                    <p className="text-xs text-gray-500">Il y a 2 jours</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
