import { MessageSquare, Send, ArrowLeft } from 'lucide-react';
import { DashboardLayout } from '../layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import type { Page } from '../../App';

interface ReclamationPageProps {
  navigate: (page: Page) => void;
  onLogout: () => void;
}

export function ReclamationPage({ navigate, onLogout }: ReclamationPageProps) {
  const reclamations = [
    { 
      id: 1, 
      titre: 'Problème de chauffage', 
      message: 'Le chauffage de ma chambre ne fonctionne plus depuis 2 jours malgré les températures basses.', 
      date: '2024-11-06 14:30',
      statut: 'EN COURS',
      reponse: 'Un technicien a été assigné et interviendra demain matin.'
    },
    { 
      id: 2, 
      titre: 'Fuite d\'eau dans la douche', 
      message: 'Il y a une fuite au niveau du pommeau de douche.', 
      date: '2024-11-01 09:15',
      statut: 'RÉSOLU',
      reponse: 'Le problème a été résolu le 02/11. Merci de votre patience.'
    },
    { 
      id: 3, 
      titre: 'Bruit excessif dans le couloir', 
      message: 'Des étudiants font du bruit tard le soir dans le couloir de l\'étage 3.', 
      date: '2024-11-08 22:45',
      statut: 'EN ATTENTE',
      reponse: null
    },
  ];

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'EN ATTENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'EN COURS':
        return 'bg-blue-100 text-blue-800';
      case 'RÉSOLU':
        return 'bg-green-100 text-green-800';
      case 'REJETÉ':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout 
      userName="Jean Dupont" 
      userRole="Étudiant"
      navigate={navigate}
      onLogout={onLogout} 
    >
      <div className="max-w-5xl mx-auto">
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
          <h1 className="text-3xl mb-2">
            Mes réclamations
          </h1>
          <p className="text-gray-600">
            Soumettez et suivez vos réclamations
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* New Complaint Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Nouvelle réclamation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titre">Titre</Label>
                  <input
                    id="titre"
                    type="text"
                    placeholder="Résumé du problème"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Décrivez votre réclamation en détail..."
                    rows={6}
                    className="resize-none"
                  />
                </div>

                <div className="text-sm text-gray-500">
                  <p>Date: {new Date().toLocaleDateString('fr-FR')}</p>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer la réclamation
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Complaints List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                Historique des réclamations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reclamations.map((reclamation) => (
                  <Card key={reclamation.id} className="border-l-4 border-l-blue-600">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="mb-1">
                            {reclamation.titre}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {reclamation.date}
                          </p>
                        </div>
                        <Badge className={getStatusColor(reclamation.statut)}>
                          {reclamation.statut}
                        </Badge>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                          {reclamation.message}
                        </p>
                      </div>

                      {reclamation.reponse && (
                        <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-l-blue-600">
                          <p className="text-xs mb-1">
                            Réponse de l'administration:
                          </p>
                          <p className="text-sm text-gray-700">
                            {reclamation.reponse}
                          </p>
                        </div>
                      )}

                      {!reclamation.reponse && reclamation.statut === 'EN ATTENTE' && (
                        <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800">
                          En attente de traitement par l'administration
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {reclamations.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>Aucune réclamation pour le moment</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="mb-1">
                  Comment soumettre une réclamation efficace ?
                </p>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Soyez précis dans la description du problème</li>
                  <li>Indiquez votre numéro de chambre si nécessaire</li>
                  <li>Mentionnez la date et l'heure si c'est pertinent</li>
                  <li>Restez courtois et professionnel</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
