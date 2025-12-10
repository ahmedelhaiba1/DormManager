import { useEffect, useState } from 'react';
import { Users, Home, Settings, TrendingUp, UserPlus, Edit, Trash2, Search, AlertCircle } from 'lucide-react';
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
  const [chambres, setChambres] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchChambresQuery, setSearchChambresQuery] = useState('');

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
    fetch(`http://localhost:8080/api/auth/verify?token=${token}`)
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
    fetch('http://localhost:8080/api/utilisateurs')
      .then((res) => res.json())
      .then((data) => {
        setUtilisateurs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    // Fetch dashboard statistics
    fetch('http://localhost:8080/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
      })
      .catch((err) => {
        console.error('Erreur lors du chargement des statistiques:', err);
      });

    // Fetch chambres
    fetch('http://localhost:8080/api/chambres')
      .then((res) => res.json())
      .then((data) => {
        setChambres(data);
      })
      .catch((err) => {
        console.error('Erreur lors du chargement des chambres:', err);
      });
  }, []);

  const handleLogout = () => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8080/api/auth/logout?token=${token}`, { method: 'POST' })
      .finally(() => {
        localStorage.clear();
        navigate('landing');
      });
  };



  // Get capacite based on type
  const getCapacite = (type: string) => {
    if (type?.toLowerCase() === 'simple') return 1;
    if (type?.toLowerCase() === 'double') return 2;
    return 1;
  };

  // Filter chambres based on search query
  const filteredChambres = chambres.filter((chambre) => {
    const query = searchChambresQuery.toLowerCase();
    return (
      chambre.numero?.toLowerCase().includes(query) ||
      chambre.type?.toLowerCase().includes(query) ||
      chambre.etat?.toLowerCase().includes(query)
    );
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ETUDIANT':
        return 'bg-gray-100 text-gray-800';
      case 'GESTIONNAIRE':
        return 'bg-green-100 text-green-800';
      case 'AGENT_TECHNIQUE':
      case 'Agent Technique':
        return 'bg-blue-100 text-blue-800';
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter users based on search query
  const filteredUtilisateurs = utilisateurs.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.nom?.toLowerCase().includes(query) ||
      user.prenom?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.role?.toLowerCase().includes(query)
    );
  });

  const handleRefreshUsers = () => {
    // Reload users from backend
    fetch('http://localhost:8080/api/utilisateurs')
      .then((res) => res.json())
      .then((data) => {
        setUtilisateurs(data);
      })
      .catch((err) => console.error(err));
  };

  const handleEditUser = (user: any) => {
    sessionStorage.setItem('editingUser', JSON.stringify(user));
    navigate('user-formula');
  };

  const handleDeleteUser = (userId: number, userName: string) => {
    const confirmDelete = window.confirm(
      `Êtes-vous sûr de vouloir supprimer l'utilisateur "${userName}" ? Cette action est irréversible.`
    );
    
    if (!confirmDelete) return;

    fetch(`http://localhost:8080/api/utilisateurs/${userId}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erreur lors de la suppression');
        alert('Utilisateur supprimé avec succès');
        handleRefreshUsers();
      })
      .catch((err) => {
        console.error(err);
        alert('Impossible de supprimer cet utilisateur');
      });
  };

  const handleEditChambre = (chambre: any) => {
    sessionStorage.setItem('editingChambre', JSON.stringify(chambre));
    navigate('chambre-formula');
  };

  const handleDeleteChambre = (chambreId: number, chambreNumero: string) => {
    const confirmDelete = window.confirm(
      `Êtes-vous sûr de vouloir supprimer la chambre "${chambreNumero}" ? Cette action est irréversible.`
    );
    
    if (!confirmDelete) return;

    fetch(`http://localhost:8080/api/chambres/${chambreId}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erreur lors de la suppression');
        alert('Chambre supprimée avec succès');
        // Reload chambres
        fetch('http://localhost:8080/api/chambres')
          .then((res) => res.json())
          .then((data) => {
            setChambres(data);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => {
        console.error(err);
        alert('Impossible de supprimer cette chambre');
      });
  };

  return (
    <DashboardLayout 
      userName={userName}
      userRole="ADMIN"
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
                  <p className="text-3xl">{stats?.totalUtilisateurs ?? '...'}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <p className="text-xs text-green-600">{(stats?.percentageUtilisateursMois ?? 0) > 0 ? '+' : ''}{(stats?.percentageUtilisateursMois ?? 0).toFixed(1)}% ce mois</p>
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
                  <p className="text-3xl">{stats?.totalChambres ?? '...'}</p>
                  <p className="text-xs text-gray-600 mt-1">{(stats?.percentageChambresOccupees ?? 0).toFixed(0)}% occupées</p>
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
                  <p className="text-3xl">{stats?.totalDemandes ?? '...'}</p>
                  <p className="text-xs text-orange-600 mt-1">{stats?.nbDemandesEnAttente ?? 0} en attente</p>
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
                  <p className="text-sm text-gray-600 mb-1">Réclamations en attente</p>
                  <p className="text-3xl">{stats?.reclamationsEnAttente ?? '...'}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-red-600" />
                    <p className="text-xs text-red-600">À résoudre</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
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
                <TabsTrigger value="parameters">
                  <Settings className="w-4 h-4" />
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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <span className="text-sm text-gray-500">{filteredUtilisateurs.length} résultats</span>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate('create-user')}>
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
                      {filteredUtilisateurs.map((user) => (
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
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteUser(user.id, `${user.prenom} ${user.nom}`)}
                              >
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
                    <div className="flex items-center gap-3">
                      <Input 
                        placeholder="Rechercher une chambre..." 
                        className="w-80"
                        value={searchChambresQuery}
                        onChange={(e) => setSearchChambresQuery(e.target.value)}
                      />
                      <span className="text-sm text-gray-500">{filteredChambres.length} résultats</span>
                    </div>
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => navigate('ajouter-chambre')}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Nouvelle chambre
                    </Button>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Numéro</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Capacité</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredChambres.map((chambre) => (
                        <TableRow key={chambre.id}>
                          <TableCell>Chambre {chambre.numero}</TableCell>
                          <TableCell>{chambre.type}</TableCell>
                          <TableCell>{getCapacite(chambre.type)} personne(s)</TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                chambre.etat?.toLowerCase() === 'disponible' 
                                  ? 'bg-green-100 text-green-800'
                                  : chambre.etat?.toLowerCase() === 'occupee'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-red-100 text-red-800'
                              }
                            >
                              {chambre.etat ? chambre.etat.charAt(0).toUpperCase() + chambre.etat.slice(1) : 'Inconnu'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleEditChambre(chambre)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteChambre(chambre.id, chambre.numero)}
                              >
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
                          <span>{(stats?.totalChambres ?? 0) - (stats?.nbChambresDisponibles ?? 0)} / {stats?.totalChambres ?? 0}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${stats?.percentageChambresOccupees ?? 0}%` }} 
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Taux d'occupation</span>
                          <span className="text-green-600">{(stats?.percentageChambresOccupees ?? 0).toFixed(0)}%</span>
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
                          <span>{stats?.etudiantsCount ?? 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span>Gestionnaires</span>
                          </div>
                          <span>{stats?.gestionnairesCount ?? 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-600" />
                            <span>Agents Techniques</span>
                          </div>
                          <span>{stats?.agentsTechniquesCount ?? 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <span>Administrateurs</span>
                          </div>
                          <span>{stats?.adminCount ?? 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Parameters Tab */}
              <TabsContent value="parameters">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Paramètres généraux</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-4">
                          <div>
                            <p className="font-medium">Nom du système</p>
                            <p className="text-sm text-gray-600">DormManager</p>
                          </div>
                          <Button variant="outline" disabled>
                            Modifier
                          </Button>
                        </div>
                        <div className="flex items-center justify-between border-b pb-4">
                          <div>
                            <p className="font-medium">Notifications par email</p>
                            <p className="text-sm text-gray-600">Non activées</p>
                          </div>
                          <Button variant="outline" disabled>
                            Configurer
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Mise à jour automatique</p>
                            <p className="text-sm text-gray-600">Quotidienne à minuit</p>
                          </div>
                          <Button variant="outline" disabled>
                            Modifier
                          </Button>
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
