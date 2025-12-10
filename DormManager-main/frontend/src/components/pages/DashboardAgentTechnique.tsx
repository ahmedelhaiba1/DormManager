import { useEffect, useState } from 'react';
import { Wrench, AlertTriangle, CheckCircle, Clock, Plus, FileText } from 'lucide-react';
import { DashboardLayout } from '../layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import type { Page } from '../../App';

interface DashboardAgentTechniqueProps {
  navigate: (page: Page) => void;
  onLogout: () => void;
}

export function DashboardAgentTechnique({ navigate, onLogout }: DashboardAgentTechniqueProps) {
  const [userName, setUserName] = useState('Agent Technique');

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

    // ✅ Verify token validity
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

  const incidents = [
    { id: 1, chambre: '304', description: 'Fuite d\'eau importante', priorite: 'Urgent', statut: 'Ouvert', date: '2024-11-08 14:30' },
    { id: 2, chambre: '201', description: 'Panne électrique', priorite: 'Moyen', statut: 'En cours', date: '2024-11-07 09:15' },
    { id: 3, chambre: '156', description: 'Fenêtre cassée', priorite: 'Faible', statut: 'En cours', date: '2024-11-06 16:45' },
    { id: 4, chambre: '402', description: 'Chauffage défectueux', priorite: 'Urgent', statut: 'Ouvert', date: '2024-11-08 11:20' },
  ];

  const incidentsResolus = [
    { id: 5, chambre: '205', description: 'Réparation robinet', date: '2024-11-05', resolvedDate: '2024-11-05' },
    { id: 6, chambre: '312', description: 'Changement ampoule', date: '2024-11-04', resolvedDate: '2024-11-04' },
  ];

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'Ouvert':
        return 'bg-red-100 text-red-800';
      case 'En cours':
        return 'bg-yellow-100 text-yellow-800';
      case 'Résolu':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioriteColor = (priorite: string) => {
    switch (priorite) {
      case 'Urgent':
        return 'bg-red-500';
      case 'Moyen':
        return 'bg-yellow-500';
      case 'Faible':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <DashboardLayout 
      userName={userName}
      userRole="Agent Technique"
      navigate={navigate}
      onLogout={handleLogout} 
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Bienvenue, {userName}</h1>
          <p className="text-gray-600">Gérez les incidents et maintenances du foyer</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Incidents ouverts</p>
                  <p className="text-3xl">12</p>
                  <p className="text-xs text-red-600 mt-1">2 urgents</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">En cours</p>
                  <p className="text-3xl">8</p>
                  <p className="text-xs text-gray-600 mt-1">En traitement</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Résolus ce mois</p>
                  <p className="text-3xl">45</p>
                  <p className="text-xs text-green-600 mt-1">+8 cette semaine</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">États des lieux</p>
                  <p className="text-3xl">23</p>
                  <p className="text-xs text-gray-600 mt-1">Ce mois</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl mb-2">
                    Signaler un nouvel incident
                  </h3>
                  <p className="text-blue-100 mb-4">
                    Créer un rapport d'incident pour intervention
                  </p>
                  <Button className="bg-white text-blue-600 hover:bg-blue-50">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau signalement
                  </Button>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl mb-2">
                    Faire un état des lieux
                  </h3>
                  <p className="text-green-100 mb-4">
                    Documenter l'état d'une chambre
                  </p>
                  <Button className="bg-white text-green-600 hover:bg-green-50">
                    <FileText className="w-4 h-4 mr-2" />
                    Nouvel état des lieux
                  </Button>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Incidents Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-blue-600" />
              Liste des incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="actifs">
              <TabsList className="mb-4">
                <TabsTrigger value="actifs">Actifs ({incidents.length})</TabsTrigger>
                <TabsTrigger value="resolus">Résolus ({incidentsResolus.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="actifs">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Priorité</TableHead>
                      <TableHead>Chambre</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date & Heure</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incidents.map((incident) => (
                      <TableRow key={incident.id} className="cursor-pointer hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getPrioriteColor(incident.priorite)}`} />
                            <span className="text-sm">{incident.priorite}</span>
                          </div>
                        </TableCell>
                        <TableCell>Ch. {incident.chambre}</TableCell>
                        <TableCell>{incident.description}</TableCell>
                        <TableCell className="text-sm text-gray-600">{incident.date}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(incident.statut)}>
                            {incident.statut}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm"
                            onClick={() => navigate('incident-details')}
                          >
                            Détails
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="resolus">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Chambre</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date signalement</TableHead>
                      <TableHead>Date résolution</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incidentsResolus.map((incident) => (
                      <TableRow key={incident.id}>
                        <TableCell>Ch. {incident.chambre}</TableCell>
                        <TableCell>{incident.description}</TableCell>
                        <TableCell className="text-sm text-gray-600">{incident.date}</TableCell>
                        <TableCell className="text-sm text-gray-600">{incident.resolvedDate}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline">
                            Voir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
