import { useEffect, useState } from 'react';
import { FileText, Home, Users, AlertTriangle, MessageSquare, Check, X, Eye } from 'lucide-react';
import { DashboardLayout } from '../layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import type { Page } from '../../App';

interface DashboardGestionnaireProps {
  navigate: (page: Page) => void;
  onLogout: () => void;
}

export function DashboardGestionnaire({ navigate, onLogout }: DashboardGestionnaireProps) {
  const [userName, setUserName] = useState('Gestionnaire');

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

    // ✅ Verify session validity
    fetch(`http://localhost:8081/api/auth/verify?token=${token}`)
      .then((res) => {
        if (!res.ok) throw new Error('Token invalide');
      })
      .catch(() => {
        localStorage.clear();
        alert('Session expirée. Veuillez vous reconnecter.');
        navigate('landing');
      });
  }, [navigate]);

  const handleLogout = () => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8081/api/auth/logout?token=${token}`, { method: 'POST' })
      .finally(() => {
        localStorage.clear();
        navigate('landing');
      });
  };

const [demandes, setDemandes] = useState<any[]>([]);
const [loadingDemandes, setLoadingDemandes] = useState(true);
const totalDemandesEnAttente = demandes.filter((d) => d.statut === 'EN_ATTENTE').length;


useEffect(() => {
  fetch('http://localhost:8081/api/demandes')
    .then((res) => {
      if (!res.ok) throw new Error('Erreur de chargement des demandes');
      return res.json();
    })
    .then((data) => {
      // Filter only "EN_ATTENTE" demandes (waiting)
      const pending = data.filter((d: any) => d.statut === 'EN_ATTENTE');
      setDemandes(pending);
      setLoadingDemandes(false);
    })
    .catch((err) => {
      console.error('❌ Erreur lors du chargement des demandes:', err);
      setLoadingDemandes(false);
    });
}, []);


  const chambres = [
    { numero: '101', type: 'Simple', batiment: 'A', statut: 'Disponible' },
    { numero: '102', type: 'Double', batiment: 'A', statut: 'Occupée' },
    { numero: '201', type: 'Simple', batiment: 'B', statut: 'Disponible' },
    { numero: '202', type: 'Double', batiment: 'B', statut: 'Maintenance' },
  ];

  return (
    <DashboardLayout 
      userName={userName}
      userRole="Gestionnaire"
      navigate={navigate}
      onLogout={handleLogout} 
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Bienvenue, {userName}</h1>
          <p className="text-gray-600">Gérez les demandes, affectations et chambres du foyer</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Étudiants logés</p>
                  <p className="text-3xl">156</p>
                  <p className="text-xs text-green-600 mt-1">+12 ce mois</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Chambres disponibles</p>
                  <p className="text-3xl">24</p>
                  <p className="text-xs text-gray-600 mt-1">Sur 200 total</p>
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
        <p className="text-sm text-gray-600 mb-1">Demandes en attente</p>
        <p className="text-3xl">
          {loadingDemandes ? '...' : totalDemandesEnAttente}
        </p>
        <p className="text-xs text-orange-600 mt-1">
          {loadingDemandes
            ? 'Chargement...'
            : totalDemandesEnAttente > 0
              ? 'À traiter'
              : 'Aucune en attente'}
        </p>
      </div>
      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
        <FileText className="w-6 h-6 text-orange-600" />
      </div>
    </div>
  </CardContent>
</Card>


          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Incidents en cours</p>
                  <p className="text-3xl">7</p>
                  <p className="text-xs text-red-600 mt-1">Urgents: 2</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Demandes en attente - 2 columns */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  Demandes en attente
                </CardTitle>
                <Input 
                  placeholder="Rechercher..." 
                  className="w-64"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Étudiant</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Filiere</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
{loadingDemandes ? (
  <TableRow>
    <TableCell colSpan={5} className="text-center text-gray-500">
      Chargement des demandes...
    </TableCell>
  </TableRow>
) : demandes.length === 0 ? (
  <TableRow>
    <TableCell colSpan={5} className="text-center text-gray-500">
      Aucune demande en attente
    </TableCell>
  </TableRow>
) : (
  demandes.map((demande) => (
    <TableRow key={demande.id}>
      <TableCell>
        {demande.etudiant?.prenom} {demande.etudiant?.nom}
      </TableCell>
      <TableCell>{demande.dateSoumission}</TableCell>
      <TableCell>{demande.etudiant?.filiere || '—'}</TableCell>
      <TableCell>
        <Badge className="bg-yellow-100 text-yellow-800">
          {demande.statut}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex gap-2 justify-end">
          <Button size="sm" variant="ghost">
            <Eye className="w-4 h-4" />
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <Check className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="destructive">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  ))
)}

                </TableBody>
              </Table>
              <Button className="w-full mt-4" variant="outline">
                Voir toutes les demandes
              </Button>
            </CardContent>
          </Card>

          {/* Chambres disponibles - 1 column */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5 text-green-600" />
                Chambres disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {chambres.map((chambre) => (
                  <div 
                    key={chambre.numero}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span>Chambre {chambre.numero}</span>
                      <Badge 
                        className={
                          chambre.statut === 'Disponible' 
                            ? 'bg-green-100 text-green-800'
                            : chambre.statut === 'Occupée'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {chambre.statut}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{chambre.type}</span>
                      <span>Bât. {chambre.batiment}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                Attribution de chambre
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Incidents et Réclamations */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Incidents signalés
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('incident-details')}
                >
                  Voir tout
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-600">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm">Fuite importante - Ch. 304</p>
                      <Badge className="bg-red-100 text-red-800">Urgent</Badge>
                    </div>
                    <p className="text-xs text-gray-500">Signalé il y a 2h</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-600">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm">Électricité défectueuse - Ch. 201</p>
                      <Badge className="bg-yellow-100 text-yellow-800">En cours</Badge>
                    </div>
                    <p className="text-xs text-gray-500">Signalé il y a 1 jour</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                Réclamations récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm">Bruit excessif - Étage 3</p>
                      <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
                    </div>
                    <p className="text-xs text-gray-500">Jean Dupont • Il y a 3h</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm">Problème de Wi-Fi</p>
                      <Badge className="bg-green-100 text-green-800">Traité</Badge>
                    </div>
                    <p className="text-xs text-gray-500">Sophie Martin • Il y a 1 jour</p>
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
