import { AlertTriangle, Calendar, User, MapPin, MessageSquare, ArrowLeft, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '../layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import type { Page } from '../../App';

interface IncidentDetailsPageProps {
  navigate: (page: Page) => void;
  onLogout: () => void;
}

export function IncidentDetailsPage({ navigate, onLogout }: IncidentDetailsPageProps) {
  return (
    <DashboardLayout 
      userName="Pierre Moreau" 
      userRole="Agent Technique"
      navigate={navigate}
      onLogout={onLogout}
    >
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate('dashboard-agent')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au dashboard
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl">
              Incident #1042
            </h1>
            <Badge className="bg-red-100 text-red-800">Urgent</Badge>
            <Badge className="bg-yellow-100 text-yellow-800">En cours</Badge>
          </div>
          <p className="text-gray-600">
            Détails et suivi de l'incident
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Info - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Incident Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Détails de l'incident
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Description</p>
                    <p className="text-lg">Fuite d'eau importante au plafond</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Description détaillée</p>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                      Une fuite d'eau a été constatée au plafond de la chambre 304. L'eau s'écoule depuis la salle de bain 
                      de l'étage supérieur. Le problème nécessite une intervention urgente car l'eau endommage le mobilier 
                      et le sol de la chambre.
                    </p>
                  </div>

                  <Separator />

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Priorité</p>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span>Urgent</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Catégorie</p>
                      <p>Plomberie</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location & Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Localisation et dates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Chambre concernée</p>
                    <p className="text-lg">Chambre 304</p>
                    <p className="text-sm text-gray-500">Bâtiment A - Étage 3</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Signalé par</p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p>Sophie Martin</p>
                        <p className="text-sm text-gray-500">Étudiante</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Date de signalement</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>08 novembre 2024 - 14:30</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Dernière mise à jour</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>08 novembre 2024 - 16:15</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments/Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  Notes et commentaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-600">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm">Pierre Moreau (Agent Technique)</p>
                      <p className="text-xs text-gray-500">16:15</p>
                    </div>
                    <p className="text-sm text-gray-700">
                      Intervention en cours. La source de la fuite a été identifiée dans la salle de bain 404. 
                      Réparation en cours.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-gray-300">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm">Marie Dubois (Gestionnaire)</p>
                      <p className="text-xs text-gray-500">14:45</p>
                    </div>
                    <p className="text-sm text-gray-700">
                      Incident assigné à Pierre Moreau. Priorité urgente confirmée.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Ajouter un commentaire</Label>
                  <Textarea 
                    placeholder="Entrez vos notes ou commentaires..."
                    rows={3}
                  />
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Ajouter un commentaire
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Status Update */}
            <Card>
              <CardHeader>
                <CardTitle>Mettre à jour le statut</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Statut actuel</Label>
                    <Select defaultValue="en-cours">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ouvert">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            Ouvert
                          </div>
                        </SelectItem>
                        <SelectItem value="en-cours">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                            En cours
                          </div>
                        </SelectItem>
                        <SelectItem value="resolu">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            Résolu
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Marquer comme résolu
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Assigned To */}
            <Card>
              <CardHeader>
                <CardTitle>Assignation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Technicien assigné</p>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p>Pierre Moreau</p>
                        <p className="text-xs text-gray-500">Agent Technique</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Réassigner
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm mb-2">
                      Incident urgent
                    </p>
                    <p className="text-xs text-gray-700">
                      Cet incident requiert une attention immédiate. Assurez-vous de le traiter 
                      dans les plus brefs délais.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Historique</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5" />
                      <div className="w-0.5 h-full bg-gray-200 mt-1" />
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm">Intervention en cours</p>
                      <p className="text-xs text-gray-500">16:15</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5" />
                      <div className="w-0.5 h-full bg-gray-200 mt-1" />
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm">Assigné à Pierre Moreau</p>
                      <p className="text-xs text-gray-500">14:45</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-gray-400 mt-1.5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">Incident créé</p>
                      <p className="text-xs text-gray-500">14:30</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
