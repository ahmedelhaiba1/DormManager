import { Home, Calendar, Download, User, MapPin, ArrowLeft } from 'lucide-react';
import { DashboardLayout } from '../layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import type { Page } from '../../App';

interface ChambreDetailsPageProps {
  navigate: (page: Page) => void;
  onLogout: () => void;
}

export function ChambreDetailsPage({ navigate, onLogout }: ChambreDetailsPageProps) {
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
          onClick={() => navigate('dashboard-etudiant')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au dashboard
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl">
              Chambre 205
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
                  <p className="text-lg">205</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Type</p>
                  <p className="text-lg">Double</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Bâtiment</p>
                  <p className="text-lg">Bâtiment A - Étage 2</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Superficie</p>
                  <p className="text-lg">18 m²</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Capacité</p>
                  <p className="text-lg">2 personnes</p>
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
                  2 lits simples
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  2 bureaux
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  2 chaises
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  2 armoires
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
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Détails de l'affectation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Date de début</p>
                <div className="flex items-center gap-2 text-lg">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  01 septembre 2024
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Date de fin</p>
                <div className="flex items-center gap-2 text-lg">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  30 juin 2025
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <p className="text-sm text-gray-600 mb-3">Colocataire</p>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p>Marc Lefebvre</p>
                  <p className="text-sm text-gray-500">Licence 2 - Informatique</p>
                </div>
              </div>
            </div>
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
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Adresse</p>
                <p>Résidence Universitaire Les Cerisiers</p>
                <p className="text-gray-600">12 Avenue des Étudiants, 75013 Paris</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Accès</p>
                <p className="text-sm text-gray-700">
                  Bâtiment A, entrée principale, 2ème étage, couloir de gauche
                </p>
              </div>
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
