import { Building2, Users, Shield, Wrench, CheckCircle, Clock, FileText, Bell, ArrowLeft, MessageSquare, BarChart3, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import type { Page } from '../../App';

interface EnSavoirPlusPageProps {
  navigate: (page: Page) => void;
}

export function EnSavoirPlusPage({ navigate }: EnSavoirPlusPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl text-gray-900">DormManager</span>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('landing')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-20">
        <div className="max-w-8xl mx-auto px-8 w py-32">
          <div className="max-w-3xl">
            <h1 className="text-6xl mb-6">
              À propos de DormManager
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              DormManager est une plateforme complète de gestion des foyers universitaires qui simplifie les processus administratifs et améliore l'expérience de tous les utilisateurs.
            </p>
            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => navigate('registration')}
              >
                Commencer maintenant
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => navigate('login')}
              >
                Se connecter
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl mb-6">Notre Mission</h2>
            <p className="text-xl text-gray-600">
              Moderniser la gestion des résidences universitaires en offrant une solution numérique intuitive qui connecte étudiants, gestionnaires, techniciens et administrateurs sur une seule plateforme.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl mb-3">Simplicité</h3>
              <p className="text-gray-600">
                Interface intuitive et facile à utiliser pour tous les profils d'utilisateurs
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl mb-3">Efficacité</h3>
              <p className="text-gray-600">
                Automatisation des processus pour gagner du temps et réduire les erreurs
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl mb-3">Transparence</h3>
              <p className="text-gray-600">
                Suivi en temps réel et notifications pour rester informé à chaque étape
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Features by Role Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl text-center mb-16">Fonctionnalités par rôle</h2>

          <div className="space-y-16">
            {/* Students */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-3xl">Étudiants</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Gérez votre logement universitaire de manière simple et efficace avec toutes les fonctionnalités dont vous avez besoin.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Soumettre et suivre les demandes d'hébergement</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Consulter les détails de votre chambre assignée</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Déposer des réclamations et suivre leur statut</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Recevoir des notifications en temps réel</span>
                  </li>
                </ul>
              </div>
              <Card className="p-8 bg-blue-50 border-blue-200">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span>Demandes d'hébergement</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <span>Informations sur la chambre</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <span>Réclamations</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                    <Bell className="w-5 h-5 text-blue-600" />
                    <span>Notifications</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Managers */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <Card className="p-8 bg-green-50 border-green-200 md:order-1">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                    <Users className="w-5 h-5 text-green-600" />
                    <span>Gestion des demandes</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                    <Building2 className="w-5 h-5 text-green-600" />
                    <span>Attribution des chambres</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    <span>Suivi d'occupation</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                    <Settings className="w-5 h-5 text-green-600" />
                    <span>Gestion des chambres</span>
                  </div>
                </div>
              </Card>
              <div className="md:order-2">
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-3xl">Gestionnaires</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Outils puissants pour gérer efficacement les demandes d'hébergement et l'attribution des chambres.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Valider et traiter les demandes d'hébergement</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Attribuer les chambres aux étudiants</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Gérer l'inventaire des chambres disponibles</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Consulter les statistiques d'occupation</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Technical Agents */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-3xl">Agents techniques</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Gérez et résolvez les incidents techniques rapidement pour maintenir la qualité des résidences.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Recevoir et traiter les signalements d'incidents</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Suivre l'état d'avancement des réparations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Marquer les incidents comme résolus</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Consulter l'historique des interventions</span>
                  </li>
                </ul>
              </div>
              <Card className="p-8 bg-orange-50 border-orange-200">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                    <MessageSquare className="w-5 h-5 text-orange-600" />
                    <span>Incidents signalés</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                    <Wrench className="w-5 h-5 text-orange-600" />
                    <span>Interventions en cours</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                    <CheckCircle className="w-5 h-5 text-orange-600" />
                    <span>Incidents résolus</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <span>Historique</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Admins */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <Card className="p-8 bg-purple-50 border-purple-200 md:order-1">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    <span>Tableaux de bord</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span>Gestion des utilisateurs</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                    <Settings className="w-5 h-5 text-purple-600" />
                    <span>Configuration système</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <span>Rapports et analyses</span>
                  </div>
                </div>
              </Card>
              <div className="md:order-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-3xl">Administrateurs</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Vue d'ensemble complète et contrôle total du système pour une gestion optimale.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Accès à tous les tableaux de bord et statistiques</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Gérer les utilisateurs et leurs rôles</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Configurer les paramètres du système</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Générer des rapports détaillés</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl text-center mb-16">Pourquoi choisir DormManager ?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl mb-3">Gain de temps</h3>
              <p className="text-gray-600">
                Automatisation des processus répétitifs pour vous concentrer sur l'essentiel
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl mb-3">Réduction des erreurs</h3>
              <p className="text-gray-600">
                Validation automatique et contrôles pour minimiser les erreurs humaines
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl mb-3">Communication améliorée</h3>
              <p className="text-gray-600">
                Notifications en temps réel pour rester informé de chaque changement
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl mb-3">Données centralisées</h3>
              <p className="text-gray-600">
                Toutes les informations au même endroit pour une meilleure visibilité
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl mb-3">Interface intuitive</h3>
              <p className="text-gray-600">
                Design moderne et facile à utiliser pour tous les utilisateurs
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl mb-3">Sécurité des données</h3>
              <p className="text-gray-600">
                Protection de vos informations avec des protocoles de sécurité robustes
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-32">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl mb-6">Prêt à commencer ?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Rejoignez DormManager dès aujourd'hui et découvrez une nouvelle façon de gérer les résidences universitaires.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => navigate('registration')}
            >
              S'inscrire maintenant
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => navigate('login')}
            >
              Se connecter
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl">DormManager</span>
            </div>
            <div className="flex gap-8 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">À propos</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
              <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2025 DormManager. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
