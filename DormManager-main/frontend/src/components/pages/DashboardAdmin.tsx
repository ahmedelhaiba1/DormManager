import { useEffect, useState } from 'react';
import { Users, Home, Settings, TrendingUp, UserPlus, Edit, Trash2, Search } from 'lucide-react';
import { DashboardLayout } from '../layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import type { Page } from '../../App';

interface DashboardAdminProps {
  navigate: (page: Page) => void;
  onLogout: () => void;
}

export function DashboardAdmin({ navigate, onLogout }: DashboardAdminProps) {
  const [userName, setUserName] = useState('Administrateur');
  const [utilisateurs, setUtilisateurs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

    // ✅ Verify token with backend
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

  useEffect(() => {
    fetch('http://localhost:8081/api/utilisateurs')
      .then((res) => res.json())
      .then((data) => {
        setUtilisateurs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8081/api/auth/logout?token=${token}`, { method: 'POST' })
      .finally(() => {
        localStorage.clear();
        navigate('landing');
      });
  };


 
    // Fetch users from backend
    fetch('/api/utilisateurs')
      .then((res) => res.json())
      .then((data) => {
        const usersWithStatus = data.map((u: any) => ({
          ...u,
          statut: 'Actif', // default value if backend doesn’t send one
          role:
            u.role && typeof u.role === 'string'
              ? u.role.charAt(0).toUpperCase() + u.role.slice(1).toLowerCase()
              : 'Inconnu',
        }));
        setUtilisateurs(usersWithStatus);
      })
      .catch((err) => console.error('Erreur de récupération des utilisateurs:', err))
      .finally(() => setLoading(false));


  const chambres = [
    { numero: '101', type: 'Simple', batiment: 'A', capacite: 1, statut: 'Disponible' },
    { numero: '102', type: 'Double', batiment: 'A', capacite: 2, statut: 'Occupée' },
    { numero: '201', type: 'Simple', batiment: 'B', capacite: 1, statut: 'Disponible' },
    { numero: '202', type: 'Double', batiment: 'B', capacite: 2, statut: 'Maintenance' },
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Étudiant':
        return 'bg-blue-100 text-blue-800';
      case 'Gestionnaire':
        return 'bg-purple-100 text-purple-800';
      case 'Agent_technique':
      case 'Agent Technique':
        return 'bg-orange-100 text-orange-800';
      case 'Administrateur':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout 
      userName={userName}
      userRole="Administrateur"
      navigate={navigate}
      onLogout={handleLogout} 
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Bienvenue, {userName}</h1>
          <p className="text-gray-600">Gestion globale du système DormManager</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total utilisateurs</p>
                  <p className="text-3xl">{loading ? '...' : utilisateurs.length}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <p className="text-xs text-green-600">+12% ce mois</p>
                  </div>
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
                  <p className="text-sm text-gray-600 mb-1">Total chambres</p>
                  <p className="text-3xl">200</p>
                  <p className="text-xs text-gray-600 mt-1">88% occupées</p>
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
                  <p className="text-sm text-gray-600 mb-1">Demandes actives</p>
                  <p className="text-3xl">34</p>
                  <p className="text-xs text-orange-600 mt-1">18 en attente</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Taux satisfaction</p>
                  <p className="text-3xl">94%</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <p className="text-xs text-green-600">+3% ce mois</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Management Tabs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              Gestion du système
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="users">
              <TabsList className="mb-4">
                <TabsTrigger value="users">
                  <Users className="w-4 h-4 mr-2" />
                  Utilisateurs
                </TabsTrigger>
                <TabsTrigger value="chambres">
                  <Home className="w-4 h-4 mr-2" />
                  Chambres
                </TabsTrigger>
                <TabsTrigger value="stats">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Statistiques
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres
                </TabsTrigger>
              </TabsList>

              {/* Users Tab */}
              <TabsContent value="users">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Input 
                        placeholder="Rechercher un utilisateur..." 
                        className="w-80"
                      />
                      <Button variant="outline">
                        <Search className="w-4 h-4 mr-2" />
                        Rechercher
                      </Button>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Nouvel utilisateur
                    </Button>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {utilisateurs.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.nom}</TableCell>
                          <TableCell className="text-gray-600">{user.email}</TableCell>
                          <TableCell>
                            <Badge className={getRoleBadgeColor(user.role)}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                             <Badge className="bg-green-100 text-green-800">Actif</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button size="sm" variant="ghost">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Chambres Tab */}
              <TabsContent value="chambres">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Input 
                      placeholder="Rechercher une chambre..." 
                      className="w-80"
                    />
                    <Button className="bg-green-600 hover:bg-green-700">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Nouvelle chambre
                    </Button>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Numéro</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Bâtiment</TableHead>
                        <TableHead>Capacité</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {chambres.map((chambre) => (
                        <TableRow key={chambre.numero}>
                          <TableCell>Chambre {chambre.numero}</TableCell>
                          <TableCell>{chambre.type}</TableCell>
                          <TableCell>Bâtiment {chambre.batiment}</TableCell>
                          <TableCell>{chambre.capacite} personne(s)</TableCell>
                          <TableCell>
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
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button size="sm" variant="ghost">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Statistics Tab */}
              <TabsContent value="stats">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Statistiques d'occupation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Chambres occupées</span>
                          <span>176 / 200</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '88%' }} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Taux d'occupation</span>
                          <span className="text-green-600">88%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Répartition des utilisateurs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span>Étudiants</span>
                          </div>
                          <span>220</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500" />
                            <span>Gestionnaires</span>
                          </div>
                          <span>15</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-orange-500" />
                            <span>Agents Techniques</span>
                          </div>
                          <span>10</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <span>Administrateurs</span>
                          </div>
                          <span>2</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Paramètres généraux</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p>Nom du système</p>
                            <p className="text-sm text-gray-600">DormManager</p>
                          </div>
                          <Button variant="outline">Modifier</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p>Notifications par email</p>
                            <p className="text-sm text-gray-600">Activées</p>
                          </div>
                          <Button variant="outline">Configurer</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p>Sauvegarde automatique</p>
                            <p className="text-sm text-gray-600">Quotidienne à 2h00</p>
                          </div>
                          <Button variant="outline">Modifier</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
