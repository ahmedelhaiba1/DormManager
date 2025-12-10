import { useEffect, useState } from "react";
import { Building2, Shield, Users, Wrench } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import type { Page } from '../../App';

interface LandingPageProps {
  navigate: (page: Page) => void;
}

export function LandingPage({ navigate }: LandingPageProps) {
   /*
   const [data, setData] = useState("Connecting...");

  useEffect(() => {
    fetch("/api/demandes")
      .then(res => res.json())
      .then(d => {
        console.log("✅ Connected to backend:", d);
        setData(JSON.stringify(d, null, 2));
      })
      .catch(err => {
        console.error("❌ Backend connection error:", err);
        setData("❌ Connection failed: " + err.message);
      });
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Backend Connection Test</h1>
      <pre>{data}</pre>
    </div>
  );
    */

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative h-screen bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1563205237-bf0bdbf8f5a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB1bml2ZXJzaXR5JTIwZG9ybWl0b3J5JTIwYnVpbGRpbmd8ZW58MXx8fHwxNzYyNjMwNTk5fDA&ixlib=rb-4.1.0&q=80&w=1080')`
        }}
      >
        {/* Header */}
        
        <nav className="absolute top-0 left-0 right-0 z-10 px-8 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <span className="text-white text-2xl">DormManager</span>
            </div>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                onClick={() => navigate('login')}
              >
                Se connecter
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => navigate('registration')}
              >
                S'inscrire (étudiant)
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <h1 className="text-6xl mb-6">
              DormManager
            </h1>
            <p className="text-2xl mb-12 text-gray-200">
              Plateforme de gestion des foyers universitaires
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                onClick={() => navigate('login')}
              >
                Commencer
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 px-8"
              >
                En savoir plus
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}

      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">
              Une solution complète pour tous
            </h2>
            <p className="text-xl text-gray-600">
              DormManager simplifie la gestion des résidences universitaires
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl mb-2">
                Pour les étudiants
              </h3>
              <p className="text-gray-600">
                Faites vos demandes d'hébergement et suivez vos affectations en temps réel
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl mb-2">
                Pour les gestionnaires
              </h3>
              <p className="text-gray-600">
                Gérez les demandes, attribuez les chambres et suivez l'occupation
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Wrench className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl mb-2">
                Pour les techniciens
              </h3>
              <p className="text-gray-600">
                Signalez et résolvez les incidents rapidement et efficacement
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl mb-2">
                Pour les admins
              </h3>
              <p className="text-gray-600">
                Vue d'ensemble complète et gestion centralisée du système
              </p>
            </Card>
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

