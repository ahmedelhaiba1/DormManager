import { Home, Calendar, Download, User, MapPin, ArrowLeft, LogOut } from 'lucide-react';
import { DashboardLayout } from '../layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import type { Page } from '../../App';
import { useEffect, useState } from 'react';

interface ChambreDetailsPageProps {
  navigate: (page: Page) => void;
  onLogout: () => void;
}

interface AffectationData {
  chambreNumero: string;
  chambreType: string;
  dateDebut: string;
  dateFin: string | null;
  remarque: string | null;
}

export function ChambreDetailsPage({ navigate, onLogout }: ChambreDetailsPageProps) {
  const [userName, setUserName] = useState('Étudiant');
  const [affectation, setAffectation] = useState<AffectationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [leaving, setLeaving] = useState(false);

  const API_BASE = 'http://localhost:8080';

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

    // Fetch affectation data
    fetch(`${API_BASE}/api/etudiants/me/affectation`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.chambreNumero) {
          setAffectation(data);
        }
      })
      .catch((err) => console.error('Erreur lors du chargement de l\'affectation:', err))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE}/api/auth/logout?token=${token}`, { method: 'POST' })
      .finally(() => {
        localStorage.clear();
        navigate('landing');
      });
  };

  const handleQuitterChambre = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir quitter la chambre ? Cette action est irréversible.')) {
      return;
    }

    const token = localStorage.getItem('token');
    setLeaving(true);

    try {
      const res = await fetch(`${API_BASE}/api/etudiants/me/affectation/quitter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ remarque: null }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors de la libération de la chambre');
      }

      alert('Vous avez quitté la chambre avec succès');
      navigate('dashboard-etudiant');
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      alert(errorMessage);
    } finally {
      setLeaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Chargement des informations...</p>
      </div>
    );
  }

  if (!affectation) {
    return (
      <DashboardLayout 
        userName={userName} 
        userRole="ETUDIANT"
        navigate={navigate}
        onLogout={handleLogout}
      >
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate('dashboard-etudiant')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au dashboard
          </Button>
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-600">Vous n'avez pas encore d'affectation de chambre.</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate derived values based on room type
  const isDouble = affectation.chambreType.toLowerCase() === 'double';
  const capacite = isDouble ? '2 personnes' : '1 personne';
  const superficie = isDouble ? '18 m²' : '9 m²';
  const equipmentCount = isDouble ? 2 : 1;

  return (
    <DashboardLayout 
      userName={userName} 
      userRole="ETUDIANT"
      navigate={navigate}
      onLogout={handleLogout}
    >
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate('dashboard-etudiant')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au dashboard
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl">
              Chambre {affectation.chambreNumero}
            </h1>
            <Badge className="bg-green-100 text-green-800">Occupée</Badge>
          </div>
          <p className="text-gray-600">
            Détails de votre affectation actuelle
          </p>
        </div>

        {/* Main Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5 text-blue-600" />
              Informations de la chambre
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Numéro de chambre</p>
                  <p className="text-lg">{affectation.chambreNumero}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Type</p>
                  <p className="text-lg">{affectation.chambreType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Superficie</p>
                  <p className="text-lg">{superficie}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Capacité</p>
                  <p className="text-lg">{capacite}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">État actuel</p>
                  <Badge className="bg-green-100 text-green-800">Bon état</Badge>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <p className="text-sm mb-3">
                Équipements disponibles
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  {equipmentCount} lit{equipmentCount > 1 ? 's' : ''} simple{equipmentCount > 1 ? 's' : ''}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  {equipmentCount} bureau{equipmentCount > 1 ? 'x' : ''}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  {equipmentCount} chaise{equipmentCount > 1 ? 's' : ''}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  {equipmentCount} armoire{equipmentCount > 1 ? 's' : ''}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Wi-Fi inclus
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Salle de bain privée
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Affectation Details */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Détails de l'affectation
              </CardTitle>
              <Button
                variant="destructive"
                size="sm"
                disabled={leaving}
                onClick={handleQuitterChambre}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Quitter la chambre
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Date de début</p>
                <div className="flex items-center gap-2 text-lg">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  {new Date(affectation.dateDebut).toLocaleDateString('fr-FR')}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Date de fin</p>
                <div className="flex items-center gap-2 text-lg">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  {affectation.dateFin ? new Date(affectation.dateFin).toLocaleDateString('fr-FR') : '—'}
                </div>
              </div>
            </div>

            {affectation.remarque && (
              <>
                <Separator className="my-6" />
                <div>
                  <p className="text-sm text-gray-600 mb-3">Remarque</p>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{affectation.remarque}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              Localisation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-sm text-gray-600 mb-1">Adresse</p>
              <p>Résidence Universitaire IBN ZOHR</p>
              <p className="text-gray-600">12 Avenue des Étudiants, 80000 Morroco, Agadir</p>
            </div>
          </CardContent>
        </Card>

        {/* État des lieux */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-600" />
                État des lieux
              </span>
              <Badge className="bg-blue-100 text-blue-800">Disponible</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-4">
              L'état des lieux d'entrée a été réalisé le 01/09/2024. Vous pouvez télécharger le document ci-dessous.
            </p>
            <div className="flex gap-3">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Télécharger état des lieux d'entrée
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Guide du résident
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
